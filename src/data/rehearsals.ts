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
  "2022": {
    "06": {
      "24": [
        { number: 1,  title: "Criss Cross (Take 1)",                    filename: "01-criss-cross-take-1.mp3" },
        { number: 2,  title: "Turn Up the Bottle (Take 1)",             filename: "02-turn-up-the-bottle-take-1.mp3" },
        { number: 3,  title: "We Drink (Take 1)",                       filename: "03-we-drink-take-1.mp3" },
        { number: 4,  title: "Good Days Good Times (Take 1)",           filename: "04-good-days-good-times-take-1.mp3" },
        { number: 5,  title: "Criss Cross (Take 2)",                    filename: "05-criss-cross-take-2.mp3" },
        { number: 6,  title: "Turn Up the Bottle (Take 2)",             filename: "06-turn-up-the-bottle-take-2.mp3" },
        { number: 7,  title: "We Drink (Take 2)",                       filename: "07-we-drink-take-2.mp3" },
        { number: 8,  title: "Good Days Good Times (Take 2)",           filename: "08-good-days-good-times-take-2.mp3" },
        { number: 9,  title: "Criss Cross Take 3 (Drunk Fast Version)", filename: "09-criss-cross-take-3-drunk-fast-version.mp3" },
        { number: 10, title: "Girl Introductory Jam",                   filename: "10-girl-introductory-jam.mp3" },
      ],
    },
  },
  "2026": {
    "04": {
      "17": [
        { number: 1, title: "Ain't No Sunshine (Early Version)", filename: "aint-no-sunshine-early-version.mp3" },
      ],
    },
    "05": {
      "15": [
        { number: 1,  title: "We Drink",                          filename: "01-we-drink.mp3" },
        { number: 2,  title: "Low",                               filename: "02-low.mp3" },
        { number: 3,  title: "Criss Cross of Chaos",              filename: "03-criss-cross-of-chaos.mp3" },
        { number: 4,  title: "Turn Up the Bottle",                filename: "04-turn-up-the-bottle.mp3" },
        { number: 5,  title: "Girl",                              filename: "05-girl.mp3" },
        { number: 6,  title: "Ain't No Sunshine",                 filename: "06-aint-no-sunshine.mp3" },
        { number: 7,  title: "Dance Till You Die",                filename: "07-dance-till-you-die.mp3" },
        { number: 8,  title: "Drop D Jam",                        filename: "08-drop-d-jam.mp3" },
        { number: 9,  title: "Drop D Jam (Guitar Intro Only)",    filename: "09-drop-d-jam(guitar-intro-only).mp3" },
        { number: 10, title: "Love Sock",                         filename: "10-love-sock.mp3" },
        { number: 11, title: "PB N Jam",                          filename: "11-pb-n-jam.mp3" },
        { number: 12, title: "Good Days Good Times",              filename: "12-good-days-good-times.mp3" },
        { number: 13, title: "Blowjob",                           filename: "13-blowjob.mp3" },
        { number: 14, title: "Jam: Too Hot for Hugs",             filename: "14-jam-too-hot-for-hugs.mp3" },
        { number: 15, title: "Shitty Sailing",                    filename: "15-shitty-sailing.mp3" },
        { number: 16, title: "We Drink 2",                        filename: "16-we-drink-2.mp3" },
      ],
      "22": [
        { number: 1,  title: "We Drink",                                  filename: "01-we-drink.mp3" },
        { number: 2,  title: "Low",                                       filename: "02-low.mp3" },
        { number: 3,  title: "Criss Cross of Chaos",                      filename: "03-criss-cross-of-chaos.mp3" },
        { number: 4,  title: "Turn Up the Bottle",                        filename: "04-turn-up-the-bottle.mp3" },
        { number: 5,  title: "Girl",                                      filename: "05-girl.mp3" },
        { number: 6,  title: "Ain't No Sunshine",                         filename: "06-aint-no-sunshine.mp3" },
        { number: 7,  title: "Dance Till You Die",                        filename: "07-dance-till-you-die.mp3" },
        { number: 8,  title: "Drop D Jam",                                filename: "08-drop-d-jam.mp3" },
        { number: 9,  title: "Love Sock",                                 filename: "09-love-sock.mp3" },
        { number: 10, title: "PB N Jam",                                  filename: "10-pb-n-jam.mp3" },
        { number: 11, title: "PB N Jam (Slower Soft Drums Version)",      filename: "11-pb-n-jam-slower-soft-drums-version.mp3" },
        { number: 12, title: "Good Days Good Times 1",                    filename: "12-good-days-good-times-1.mp3" },
        { number: 13, title: "Good Days Good Times 2",                    filename: "13-good-days-good-times-2.mp3" },
        { number: 14, title: "Too Hot For Hugs (Smokey Stoner Jam)",        filename: "14-smokey-stoner-jam.mp3" },
        { number: 15, title: "Shitty Sailing (Bass & Guitar Only)",       filename: "15-shitty-sailing-bass-n-guitar-only.mp3" },
        { number: 16, title: "Shitty Sailing",                            filename: "16-shitty-sailing.mp3" },
        { number: 17, title: "Three Minutes Till 9 Jam",                  filename: "17-three-minutes-till-9-jam.mp3" },
        { number: 18, title: "Joe Song Idea",                             filename: "18-joe-song-idea.mp3" },
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
