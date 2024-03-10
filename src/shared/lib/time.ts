export class Time {
  static millisecond(i = 1) {
    return 1 * i
  }

  static second(i = 1) {
    return this.millisecond(1000) * i
  }

  static minute(i = 1) {
    return this.second(60) * i
  }

  static hour(i = 1) {
    return this.minute(60) * i
  }

  static day(i = 1) {
    return this.hour(24) * i
  }
}
