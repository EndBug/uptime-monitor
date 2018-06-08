/**
 * @author Federico Grandi <fgrandi30@gmail.com>
 */

class Target {
  /**
   * constructor - create a target
   *
   * @param  {string}     name     The name of the target, only for debug purposes
   * @param  {string}     id       The id of the target
   * @param  {number}     minutes  The minutes that the bot should wait to recheck
   * @return {undefined}
   */
  constructor(name = "", id = "", minutes) {
    this.err = null;

    if (!name.startsWith("Manual")) {
      if (id == "") throw new Error(`Cannot build a target without valid id:\nNAME: ${name}\nID: ${id}`);
      if (isNaN(minutes)) throw new Error(`Cannot build a target without a valide timeout:\nNAME: ${name}\nTIMEOUT: ${minutes}`);
    } else {
      if (id == "") this.err = `Cannot build a target without valid id:\nNAME: ${name}\nID: ${id}`;
      else if (isNaN(minutes)) this.err = `Cannot build a target without a valide timeout:\nNAME: ${name}\nTIMEOUT: ${minutes}`;
    }

    if (this.err == null) {
      this.id = id;
      this.timeout = minutes * 60 * 1000; //ms
      this.focused = false;
      this.torecheck = false;
      this.reported = false;
    }
  }

  /**
   * focus - change this.focused and start second check timer
   *
   * @param  {boolean} value
   * @return {undefined}
   */
  focus(value = true) {
    this.focused = value;
    setTimeout(() => {
      this.recheck();
    }, this.timeout);
  }

  /**
   * recheck - change this.torecheck
   *
   * @param  {boolean} value
   * @return {undefined}
   */
  recheck(value = true) {
    this.torecheck = value;
  }

  /**
   * report - change this.reported and set this.focused to false
   *
   * @param  {boolean} value
   * @return {undefined}
   */
  report(value = true) {
    this.reported = value;
    this.focused = false;
  }
}

class TargetList {
  /**
   * constructor - create a new list
   *
   * @param  {Target | Array[Target]} ts Target or array of Targets that the list should include
   * @return {undefined}
   */
  constructor(ts = []) {
    if (ts instanceof Target) ts = [ts];
    if (!(ts instanceof Array)) throw new Error(`Cannot build target list without a valid argument:\n${ts}`);

    this.array = ts;
  }

  /**
   * add - add a Target to the list
   *
   * @param  {string} id      The id of the target
   * @param  {number} minutes The minutes that the bot should wait to recheck
   * @return {undefined}
   */
  add(id = "", minutes) {
    let curr = new Target(`Manual (${new Date()})`, id, minutes);
    if (curr.err == null) {
      this.array.push(curr);
      return curr;
    } else return curr.err;
  }
}

module.exports = {
  "owner": "218308478580555777",
  "guild": "266553379201875968",
  "loop": 1 * 60 * 1000, //ms
  "watched": new TargetList([
    new Target("TRT Bot", "330773448324415489", 10),
  ])
};