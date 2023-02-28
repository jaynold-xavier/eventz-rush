class User {
  constructor({ userName, email }) {
    this.userName = userName;
    this.email = email;
  }
}

class Vendor extends User {
  constructor({
    description,
    email,
    phoneNumber,
    photoUrls,
    services,
    title,
    userName,
    website,
  }) {
    super({ userName, email });
    this.description = description;
    this.phoneNumber = phoneNumber;
    this.photoUrls = photoUrls;
    this.services = services;
    this.title = title;
    this.website = website;
  }
}

class Host extends User {
  constructor({ userName, email, name }) {
    super({ userName, email });
    this.name = name;
  }
}

class Event {
  constructor() {}
}

class Review {
  constructor() {}
}

class Notification {
  constructor() {}
}

export { Vendor, Host };
