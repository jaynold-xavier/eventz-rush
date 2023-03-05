class User {
  constructor({ userName, email, photoUrl }) {
    this.userName = userName;
    this.email = email;
    this.photoUrl = photoUrl;
    // this.password = password;
  }
}

class Host extends User {
  constructor({ userName, email, photoUrl }) {
    super({ userName, email, photoUrl });
  }
}

class Vendor extends User {
  constructor({
    description,
    email,
    phoneNumber,
    photoUrl,
    services,
    title,
    userName,
    website,
  }) {
    super({ userName, email, photoUrl });
    this.description = description;
    this.phoneNumber = phoneNumber;
    this.services = services;
    this.title = title;
    this.website = website;
  }
}

class Event {
  constructor(
    id,
    title,
    type,
    description,
    location,
    createdOn,
    status,
    fromDate,
    toDate,
    vendors,
    bannerUrl,
    totalCost,
    hostEmail
  ) {
    this.id = id;
    this.hostEmail = hostEmail;
    this.vendors = vendors;
    this.title = title;
    this.type = type;
    this.description = description;
    this.location = location;
    this.createdOn = createdOn;
    this.status = status;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.bannerUrl = bannerUrl;
    this.totalCost = totalCost;
  }
}

// class Review {
//   constructor() {}
// }

// class Notification {
//   constructor() {}
// }

export { Vendor, Host, Event };
