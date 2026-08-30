export interface MunicipalityInfo {
  name: string;
  maxWards: number;
}

export interface DistrictInfo {
  name: string;
  municipalities: MunicipalityInfo[];
}

export const BAGMATI_PROVINCE_DATA: DistrictInfo[] = [
  {
    name: "Kathmandu",
    municipalities: [
      { name: "Kathmandu Metropolitan City", maxWards: 32 },
      { name: "Kirtipur Municipality", maxWards: 10 },
      { name: "Budhanilkantha Municipality", maxWards: 13 },
      { name: "Chandragiri Municipality", maxWards: 15 },
      { name: "Tokha Municipality", maxWards: 11 },
      { name: "Tarakeshwar Municipality", maxWards: 11 },
      { name: "Gokarneshwar Municipality", maxWards: 9 },
      { name: "Nagarjun Municipality", maxWards: 10 },
      { name: "Kageshwari Manohara Municipality", maxWards: 9 },
      { name: "Shankharapur Municipality", maxWards: 9 },
      { name: "Dakshinkali Municipality", maxWards: 9 },
    ],
  },
  {
    name: "Lalitpur",
    municipalities: [
      { name: "Lalitpur Metropolitan City", maxWards: 29 },
      { name: "Mahalaxmi Municipality", maxWards: 10 },
      { name: "Godawari Municipality", maxWards: 14 },
      { name: "Bagmati Rural Municipality", maxWards: 7 },
      { name: "Mahankal Rural Municipality", maxWards: 6 },
      { name: "Konjyosom Rural Municipality", maxWards: 5 },
    ],
  },
  {
    name: "Bhaktapur",
    municipalities: [
      { name: "Bhaktapur Municipality", maxWards: 10 },
      { name: "Madhyapur Thimi Municipality", maxWards: 9 },
      { name: "Suryabinayak Municipality", maxWards: 10 },
      { name: "Changunarayan Municipality", maxWards: 9 },
    ],
  },
  {
    name: "Kavrepalanchok",
    municipalities: [
      { name: "Banepa Municipality", maxWards: 14 },
      { name: "Dhulikhel Municipality", maxWards: 12 },
      { name: "Panauti Municipality", maxWards: 12 },
      { name: "Panchkhal Municipality", maxWards: 13 },
      { name: "Namobuddha Municipality", maxWards: 11 },
      { name: "Mandandeupur Municipality", maxWards: 12 },
      { name: "Bethianchowk Rural Municipality", maxWards: 6 },
    ],
  },
  {
    name: "Chitwan",
    municipalities: [
      { name: "Bharatpur Metropolitan City", maxWards: 29 },
      { name: "Ratnanagar Municipality", maxWards: 16 },
      { name: "Khairahani Municipality", maxWards: 13 },
      { name: "Madi Municipality", maxWards: 9 },
      { name: "Rapti Municipality", maxWards: 13 },
      { name: "Kalika Municipality", maxWards: 11 },
      { name: "Ichchhakamana Rural Municipality", maxWards: 7 },
    ],
  },
  {
    name: "Makwanpur",
    municipalities: [
      { name: "Hetauda Sub-Metropolitan City", maxWards: 19 },
      { name: "Thaha Municipality", maxWards: 12 },
      { name: "Bhimfedhi Rural Municipality", maxWards: 9 },
      { name: "Makawanpurgadhi Rural Municipality", maxWards: 8 },
      { name: "Bakaiya Rural Municipality", maxWards: 12 },
      { name: "Manhari Rural Municipality", maxWards: 9 },
    ],
  },
  {
    name: "Dhading",
    municipalities: [
      { name: "Nilkantha Municipality", maxWards: 14 },
      { name: "Dhunibeshi Municipality", maxWards: 9 },
      { name: "Galchi Rural Municipality", maxWards: 8 },
      { name: "Gajuri Rural Municipality", maxWards: 8 },
      { name: "Thakre Rural Municipality", maxWards: 11 },
    ],
  },
  {
    name: "Nuwakot",
    municipalities: [
      { name: "Bidur Municipality", maxWards: 13 },
      { name: "Belkotgadhi Municipality", maxWards: 13 },
      { name: "Kakani Rural Municipality", maxWards: 8 },
      { name: "Likhu Rural Municipality", maxWards: 6 },
    ],
  },
  {
    name: "Sindhupalchok",
    municipalities: [
      { name: "Chautara Sangachokgadhi Municipality", maxWards: 14 },
      { name: "Melamchi Municipality", maxWards: 13 },
      { name: "Barhabise Municipality", maxWards: 9 },
      { name: "Helambu Rural Municipality", maxWards: 7 },
      { name: "Indrawati Rural Municipality", maxWards: 12 },
    ],
  },
  {
    name: "Dolakha",
    municipalities: [
      { name: "Bhimeshwar Municipality", maxWards: 9 },
      { name: "Jiri Municipality", maxWards: 9 },
      { name: "Gaurishankar Rural Municipality", maxWards: 9 },
      { name: "Baiteshwar Rural Municipality", maxWards: 8 },
    ],
  },
  {
    name: "Ramechhap",
    municipalities: [
      { name: "Manthali Municipality", maxWards: 14 },
      { name: "Ramechhap Municipality", maxWards: 9 },
      { name: "Khandadevi Rural Municipality", maxWards: 9 },
      { name: "Gokulganga Rural Municipality", maxWards: 6 },
    ],
  },
  {
    name: "Sindhuli",
    municipalities: [
      { name: "Kamalamai Municipality", maxWards: 14 },
      { name: "Dudhouli Municipality", maxWards: 14 },
      { name: "Sunkoshi Rural Municipality", maxWards: 7 },
      { name: "Marin Rural Municipality", maxWards: 7 },
    ],
  },
  {
    name: "Rasuwa",
    municipalities: [
      { name: "Gosaikunda Rural Municipality", maxWards: 6 },
      { name: "Uttargaya Rural Municipality", maxWards: 5 },
      { name: "Kalika Rural Municipality", maxWards: 5 },
      { name: "Naukunda Rural Municipality", maxWards: 6 },
    ],
  },
];
