/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = dice => {
    return this.val * this.count(dice, this.val);
  };
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = dice => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
  };
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
  // TODO
  evalRoll = dice => {
    return ((this.freq(dice).some(c => c === 3) && this.freq(dice).some(c => c === 2)) ? this.score : 0)
  }
}

/** Check for small straights. */

class SmallStraight extends Rule {
  // TODO
  evalRoll = dice => {
    const d = new Set(dice);
    // const s1 = new Set(1,2);
    // const s2 = new Set(1,6);
    // const s3 = new Set(5,6);
    //small straight have 4 unique dice & only one out of three can be there (5,6) , (1,2) & (1,6)
    return ((d.size === 4 && (!d.has(1) && !d.has(2) || !d.has(1) && !d.has(6) || !d.has(5) && !d.has(6))) || (d.size === 5 && (!d.has(1) || !d.has(6))) ? this.score : 0)
  }
}

/** Check for large straights. */

class LargeStraight extends Rule {
  evalRoll = dice => {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = dice => {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 , description : "1 point for each ones" });
const twos = new TotalOneNumber({ val: 2 , description : "2 point for each twos" });
const threes = new TotalOneNumber({ val: 3 , description : "3 point for each threes" });
const fours = new TotalOneNumber({ val: 4 , description : "4 point for each fours" });
const fives = new TotalOneNumber({ val: 5 , description : "5 point for each fives" });
const sixes = new TotalOneNumber({ val: 6 , description : "6 point for each sixs" });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 , description : "Sum of dice for 3 same dices" });
const fourOfKind = new SumDistro({ count: 4 , description : "Sum of dice for 4 same dices" });

// full house scores as flat 25
const fullHouse = new FullHouse({ score: 25 , description : "	If 3 of one value and 2 of another, score 25" });

// small/large straights score as 30/40
const smallStraight = new SmallStraight({ score: 30 , description : "	If 4+ values in a row, score 30" });
const largeStraight = new LargeStraight({ score: 40 , description : "If 5 values in a row, score 40" });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 , description : "If all values match, score 50" });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 , description : "	Score sum of all dice" });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
