import { getCustomRepository, Repository } from "typeorm";
//
import SettingsRepository from "../repositories/SettingsRepository";
import Setting from "../entities/Setting"

interface SettingsCreateDTO {
  chat: boolean;
  username: string;
};

class SettingsService {
  private settingsRepository: Repository<Setting>;

  constructor(){
    this.settingsRepository = getCustomRepository(SettingsRepository);
  };

  async create({ chat, username }: SettingsCreateDTO) {
    const usernameAlreadyExists = await this.settingsRepository.findOne({ username });

    if (!!usernameAlreadyExists) {
      throw new Error("user already exists");
    };

    const settings = this.settingsRepository.create({
      chat,
      username
    });

    await this.settingsRepository.save(settings);

    return settings;
  };

  async findByUsername(username: string){
    const settings = await this.settingsRepository.findOne({ username });
    return settings;
  };

  async update(username: string, chat: boolean){
    await this.settingsRepository.createQueryBuilder()
    .update(Setting)
    .set({chat})
    .where("username = :username", {
      username
    }).execute();
  };
}

export default SettingsService;