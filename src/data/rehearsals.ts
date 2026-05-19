export interface Track {
  number: number;
  title: string;
  filename: string;
}

export interface RehearsalData {
  [year: string]: {
    [month: string]: {
      [day: string]: Track[];
    };
  };
}

export const rehearsals: RehearsalData = {
  "2026": {
    "05": {
      "15": [
        { number: 1,  title: "We Drink",                filename: "01-we-drink.mp3" },
        { number: 2,  title: "Low",                     filename: "02-low.mp3" },
        { number: 3,  title: "Criss Cross",             filename: "03-criss-cross.mp3" },
        { number: 4,  title: "Turn Up Bottle",          filename: "04-turn-up-bottle.mp3" },
        { number: 5,  title: "Girl",                    filename: "05-girl.mp3" },
        { number: 6,  title: "Ain't No Sunshine",       filename: "06-aint-no-sunshine.mp3" },
        { number: 7,  title: "New Ish Punky One",       filename: "07-new-ish-punky-one.mp3" },
        { number: 8,  title: "Jam",                     filename: "08-jam.mp3" },
        { number: 9,  title: "Jam (Guitar Intro Only)", filename: "09-jam-guitar-intro-only.mp3" },
        { number: 10, title: "New One",                 filename: "10-new-one.mp3" },
        { number: 11, title: "PB Jam",                  filename: "11-pb-jam.mp3" },
        { number: 12, title: "Good Days Good Times",    filename: "12-good-days-good-times.mp3" },
        { number: 13, title: "Blowjob",                 filename: "13-blowjob.mp3" },
        { number: 14, title: "Jam: Too Hot for Hugs",   filename: "14-jam-too-hot-for-hugs.mp3" },
        { number: 15, title: "Shitty Sailing",          filename: "15-shitty-sailing.mp3" },
        { number: 16, title: "We Drink 2",              filename: "16-we-drink-2.mp3" },
      ],
    },
  },
};

export const MONTH_NAMES: Record<string, string> = {
  "01": "January", "02": "February", "03": "March",    "04": "April",
  "05": "May",     "06": "June",     "07": "July",     "08": "August",
  "09": "September","10": "October", "11": "November", "12": "December",
};

export function getAudioPath(year: string, month: string, day: string, filename: string): string {
  return `/audio/rehearsals/${year}-${month}-${day}/${filename}`;
}
