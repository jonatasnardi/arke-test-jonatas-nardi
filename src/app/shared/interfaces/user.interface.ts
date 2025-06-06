export interface IUser {
  address: IUserAddress;
  company: IUserCompany;
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
  website: string;
}

export interface IUserAddress {
  city: string;
  geo: {
    lat: string;
    lng: string;
  };
  street: string;
  suite: string;
  zipcode: string;
}

export interface IUserCompany {
  bs: string;
  catchPhrase: string;
  name: string;
}
