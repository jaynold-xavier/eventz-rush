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
    bannerURL,
    amount,
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
    this.bannerURL = bannerURL;
    this.amount = amount;
  }
}

class Invitee {
  constructor({ inviteeId, hostEmail, status, services, amount, type }) {
    this.hostEmail = hostEmail;
    this.inviteeId = inviteeId;
    this.services = services;
    this.status = status;
    this.amount = amount;
    this.type = type;
    this.respondedOn = new Date();
  }
}

class Payment {
  constructor({ id, eventId, status, part, amount }) {
    this.id = id;
    this.eventId = eventId;
    this.part = part;
    this.status = status;
    this.amount = amount;
  }
}

// class Review {
//   constructor() {}
// }

// class Notification {
//   constructor() {}
// }

export { Vendor, Host, Event, Invitee, Payment };
