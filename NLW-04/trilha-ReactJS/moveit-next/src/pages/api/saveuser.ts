import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "../../services/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    const { name, picture } = JSON.parse(data);
    const { db } = await connectToDatabase();

    const userAlreadyExists = await db
        .collection("users")
        .findOne({ name, picture });

    if (userAlreadyExists) {
        return res.json({ error: "User already exists" });
    }

    const document = await db
        .collection("users")
        .insertOne({ name, picture });

    // const movies = await db
    //     .collection("movies")

    //     .find({})

    //     .sort({ metacritic: -1 })

    //     .limit(20)

    //     .toArray();
    res.json(document);
}