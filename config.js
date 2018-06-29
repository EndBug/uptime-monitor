/**
 * @author Federico Grandi <fgrandi30@gmail.com>
 */

var settings = require("./settings.json");

class Target {
  /**
   * constructor - create a target
   *
   * @param  {String}     name     The name of the target, only for debug purposes
   * @param  {String}     id       The id of the target
   * @param  {Number}     minutes  The minutes that the bot should wait to recheck
   * @returns {Undefined}
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
   * @param  {Boolean} value
   * @returns {Undefined}
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
   * @param  {Boolean} value
   * @returns {Undefined}
   */
  recheck(value = true) {
    this.torecheck = value;
  }

  /**
   * report - change this.reported and set this.focused to false
   *
   * @param  {Boolean} value
   * @returns {Undefined}
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
   * @returns {Undefined}
   */
  constructor(ts = []) {
    if (ts instanceof Target) ts = [ts];
    if (!(ts instanceof Array)) throw new Error(`Cannot build target list without a valid argument:\n${ts}`);

    this.array = ts;
  }

  /**
   * add - add a Target to the list
   *
   * @param  {String} name    The name of the target, only for debug purposes
   * @param  {String} id      The id of the target
   * @param  {Number} minutes The minutes that the bot should wait to recheck
   * @returns {Undefined}
   */
  add(name = "", id = "", minutes) {
    if (name == "") name = `Manual (${new Date()})`;
    let curr = new Target(name, id, minutes);
    if (curr.err == null) {
      this.array.push(curr);
      return curr;
    } else return curr.err;
  }
}

/**
 * listFromSettings - create a TargetList from the settings.json file
 *
 * @param  {Array[Array]} arr The target form
 * @returns {TargetList}       The resulting list
 */
function listFromSettings(arr = []) {
  let list = new TargetList();
  if (!(arr instanceof Array)) throw new Error(`Cannot build TargetList without valid array:\n${arr}`);
  for (let curr of arr) {
    if (!(curr instanceof Array)) throw new Error(`Invalid target format in settings.json:\n${curr}`);
    list.add(curr[0], curr[1], curr[2]);
  }
  return list;
}

module.exports = {
  guild: settings.guild,
  loop: settings.min * 60 * 1000, //ms
  owner: settings.owner,
  status: settings.status,
  watched: listFromSettings(settings.list)
};