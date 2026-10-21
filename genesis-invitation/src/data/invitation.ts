// All page content lives here. Edit names, dates and text in this file only.

export interface EventDetails {
  title: string;
  dateLabel: string; // e.g. "Wednesday"
  day: string;
  monthYear: string;
  weekday: string;
  timeLabel: string;
  venue: string;
  city: string;
  venueMapUrl: string; // leave empty to hide the "Get directions" button
  noticeDate: string;
  // Calendar (IST, 24h)
  startISO: string; // local IST wall time
  endISO: string;
}

export interface Person {
  name: string;
  role?: string;
}

export interface PersonGroup {
  label: string;
  people: Person[];
}

export interface TimelineEntry {
  date: string;
  title: string;
  note?: string;
  quote?: string;
}

export interface Member {
  name: string;
  role?: string; // optional, shown under the name
}

export interface MemberPanel {
  title: string; // "Panel 1", "Final participants"
  final?: boolean;
  members: Member[];
}

export const event: EventDetails = {
  title: 'Genesis Internationale – Official Meeting',
  dateLabel: 'Wednesday',
  day: '21',
  monthYear: 'October 2026',
  weekday: 'Wednesday',
  timeLabel: '12:00 pm to 2:30 pm',
  venue: 'Star Hotel',
  city: 'Mumbai',
  venueMapUrl: '',
  noticeDate: '17/10/2026',
  startISO: '2026-10-21T12:00:00',
  endISO: '2026-10-21T14:30:00',
};

export const welcomeLine = 'You are warmly welcomed to our official meeting.';

// Wrap a phrase in **double asterisks** to highlight it in gold.
export const agenda: string[] = [
  'An agenda is scheduled for **21st October 2026** at a **Star Hotel, Mumbai**. The meeting will be held for around 2 to 3 hours (**12:00 pm to 2:30 pm**), with all the notable people mentioned below.',
  'The context of the meeting is about the **receipt of the final order copy** regarding the fund transaction, and also about the **allocation and distribution of funds** to each individual under our company.',
];

export const chief: Person & { place: string; photo?: string } = {
  name: 'Mr. Ravikumar P',
  role: 'Chief of Genesis Internationale',
  place: 'Chennai, Tamil Nadu',
  // photo: '/chief.jpg',  // drop a file in /public and uncomment; a monogram is shown otherwise
};

export const peopleGroups: PersonGroup[] = [
  {
    label: 'Chief guests',
    people: [
      { name: 'Hon. Qureshi Ahamad', role: 'Judge, Dongri' },
      { name: 'Hon. Pankaj Bharadwaj', role: 'Judge, Chandigarh' },
      { name: 'Mrs. Anu Pankaj', role: 'Chandigarh' },
    ],
  },
  {
    label: 'Delegates of JM Nobel',
    people: [
      { name: 'Mrs. Reshma', role: 'Dehradun' },
      { name: 'Mr. Antro', role: 'Germany' },
      { name: 'Mr. Anil Gandhi', role: 'Germany' },
      { name: 'Mr. Sachin', role: 'Germany' },
    ],
  },
  {
    label: 'Finance controllers',
    people: [
      { name: 'Mr. Ramesh Bora', role: 'Consultant' },
      { name: 'Mr. Sunil Reddy', role: 'Organizer' },
    ],
  },
];

export const timeline: TimelineEntry[] = [
  { date: '17 Oct', title: 'Notice of meeting and agenda issued' },
  { date: '21 Oct', title: 'Meeting in Mumbai', note: '12:00 pm to 2:30 pm, Star Hotel' },
  {
    date: '23 Oct',
    title: 'Return to Tamil Nadu',
    quote:
      'After successfully completing that meetup, I’ll mostly return to Tamil Nadu by 23rd October 2026. By that time, all of our company members will come to know the result and success story of our 24 years of hustle.',
  },
  {
    date: '26 Oct',
    title: 'Members called',
    quote:
      'Later, in the next 2 to 3 days (mostly on 26th October), company members will be called to initiate the transaction process.',
  },
];

export const thankYou =
  'I thank you all from my heart, for being the pillars of our company and for helping me till this last moment.';

// TODO: confirm final list with client.
// The client's latest video shows a slightly different list:
//  - "Subramanian G – Financial Advisor", "DubaiSundaram G – Advocate" and
//    "Sunil Srichand Ahuja – Auditor" appear with roles (use the optional `role` field).
//  - Duraisamy M, Deivasigamani K C and Vijayakumar M are added.
//  - Senthilkumar R appears.
const original: string[] = [
  'Sivakumar G', 'Sreeman L', 'Kannadasan A', 'Ayyanarappan M', 'Balakrishnan P', 'Subramani P',
  'Chandrabose R', 'Nagarajan G', 'Mohan N', 'Tamilarasan V', 'Gijiendrakumar R', 'Ashok S',
  'Senthilkumar P', 'Ramesh R', 'Sundaram G', 'Sunil Srichand Ahuja', 'Parandaman S', 'Tamilselvam P S',
  'Siranjeevi P', 'Rajan S', 'Mohanasundaram S', 'Subramaniyam S P', 'Radhakrishnan V', 'Raja R',
  'Chinnadurai C', 'Natarajan S', 'Savadamuthu S', 'Kumar G', 'Muthukumaresan V', 'Vairavel R A',
  'Vadivel P', 'Eswaramoorthy T S', 'Kaliappan L', 'Thiyaneshwaran C', 'Jayanthi', 'Balasubramanian S',
  'Chinnusamy K', 'Viswanathan S', 'Nataraajan V N', 'Panneerselvam N', 'Theivam K', 'Pravinkumar K',
  'Sengodan N', 'Sureshkumar P R', 'Venkatesan A', 'Nallathambi A', 'Gopi P',
];

const additional: string[] = [
  'Munusamy N', 'Selvam A', 'Natarajan P', 'Arasu M P', 'Ponnusamy P S', 'Selvarasu P', 'Angamuthu C',
  'Kathirvel C', 'Senthil C', 'Rajendran S', 'Senthilkumar N', 'Pachieappan V P', 'Chandramohan K V',
  'Rathinasamy S C', 'Karunakaran T M', 'Kalaiarasi B', 'Eswaramurthi K C', 'Eswaramoorthy S',
  'Navaneethakrishnan R', 'Shanthi', 'Kadirvel N', 'Thangadurai S', 'Maheswari Jaganathan',
  'Venkataslapathi N', 'Abdul Majeed A', 'Hassan Muhammad M', 'Jaleel alias Moosakutty',
];

const finalParticipants: string[] = ['Ravikumar R', 'Periyasamy G', 'Murali R', 'Chandrasekar K'];

const PANEL_SIZE = 6;

function toPanels(names: string[]): MemberPanel[] {
  const out: MemberPanel[] = [];
  for (let i = 0; i < names.length; i += PANEL_SIZE) {
    out.push({
      title: `Panel ${out.length + 1}`,
      members: names.slice(i, i + PANEL_SIZE).map((name) => ({ name })),
    });
  }
  return out;
}

export const memberPanels: MemberPanel[] = [
  ...toPanels([...original, ...additional]),
  { title: 'Final participants', final: true, members: finalParticipants.map((name) => ({ name })) },
];

export const memberCount = memberPanels.reduce((n, p) => n + p.members.length, 0);

export const signature = { with: 'With faith,', name: 'P Ravikumar', company: 'Genesis Internationale' };

export const footer = 'Genesis Internationale · Chennai, Tamil Nadu';

export const shareText = 'You are warmly invited to the Genesis Internationale official meeting, 21 October 2026, Star Hotel, Mumbai.';
