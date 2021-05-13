import { Socket } from "socket.io";
import { io } from "../http";
//
import ConnectionsService from "../services/ConnectionsService";
import MessageService from "../services/MessagesService";
import UsersService from "../services/UsersService";
//
interface IParams {
  text: string;
  email: string;
}
//
io.on("connect", (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const userService = new UsersService();
  const messagesService = new MessageService();
  socket.on("client_first_access", async params => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;
    let user_id = null;

    const userExists = await userService.findByEmail(email);

    if (!userExists) {
      const user = await userService.create( email );
      await connectionsService.create({
        socket_id,
        user_id: user.id,
      })
      user_id = user.id
    } else {
      user_id = userExists.id;

      const connection = await connectionsService.findByUserId(userExists.id);

      if (!connection) {
        await connectionsService.create({
          socket_id,
          user_id: userExists.id,
        })
      } else {
        connection.socket_id = socket_id;
        await connectionsService.create(connection);
      }
    }

    await messagesService.create({
      text,
      user_id,
    })

    const allMessages = await messagesService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async params => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const { user_id } = await connectionsService.findBySocketId(socket_id);

    const message = await messagesService.create({ text, user_id })

    console.log(socket_id);

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id
    })
  })
});