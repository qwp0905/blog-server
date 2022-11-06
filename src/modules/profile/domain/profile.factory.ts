import { IProfile, IProfileProperties, Profile } from './profile'

export class ProfileFactory {
  reconstitute(properties: IProfileProperties): IProfile {
    return new Profile(properties)
  }
}
