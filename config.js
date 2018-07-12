/*global isID*/
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
   */
  constructor(name = "", id = "", minutes) {
    this.err = null;

    if (!name.startsWith("Manual")) {
      if (!isID(id)) throw new Error(`Cannot build a target without valid id:\nNAME: ${name}\nID: ${id}`);
      if (isNaN(minutes)) throw new Error(`Cannot build a target without a valide timeout:\nNAME: ${name}\nTIMEOUT: ${minutes}`);
    } else {
      if (!isID(id)) this.err = `Cannot build a target without valid id:\nNAME: ${name}\nID: ${id}`;
      else if (isNaN(minutes)) this.err = `Cannot build a target without a valide timeout:\nNAME: ${name}\nTIMEOUT: ${minutes}`;
    }

    if (this.err == null) {
      this.name = name;
      this.downtime;
      this.focused = false;
      this.id = id;
      this.msg;
      this.reported = false;
      this.timeout = minutes * 60 * 1000; //ms
      this.torecheck = false;
    }
  }

  /**
   * checkMessage - checks whether the saved message still exists
   *
   * @returns {Promise<?Discord.Message>}
   */
  checkMessage() {
    console.log(this.msg.id);
    return new Promise((resolve, reject) => {
      if (!this.msg) resolve(undefined);
      this.msg.channel.fetchMessage(this.msg.id).then(m => {
        resolve(m ? this.msg : undefined);
      }).catch(reject);
    });
  }

  /**
   * focus - change this.focused and start second check timer
   *
   * @param {boolean} value The value to set this.focused to
   */
  focus(value = true) {
    this.focused = value;
    setTimeout(() => {
      this.recheck();
    }, this.timeout);
  }

  /**
   * getDowntime - returns the downtime
   *
   * @returns {number} number of downtime minutes
   */
  getDowntime() {
    let now = new Date();
    return Math.round((now - this.downtime) / 60000); //in minutes
  }

  /**
   * offline - updates the offline time
   *
   * @returns {Date} the resulting date
   */
  offline() {
    this.downtime = new Date();
    return this.downtime;
  }

  /**
   * online - resets the offline time
   *
   * @returns {null}
   */
  online() {
    this.downtime = null;
    return null;
  }

  /**
   * recheck - change this.torecheck
   *
   * @param {boolean} value The value to set this.torecheck to
   */
  recheck(value = true) {
    this.torecheck = value;
  }

  /**
   * report - change this.reported, set this.focused to false and update offline time
   *
   * @param {boolean} value The value to set this.reported to
   */
  report(value = true) {
    this.reported = value;
    this.focused = false;
  }

  /**
   * setMessage - stores the message
   *
   * @param {Discord.Message} msg The message to save
   */
  setMessage(msg) {
    console.log(msg == undefined);
    this.msg = msg;
  }
}

class TargetList {
  /**
   * constructor - create a new list
   *
   * @param  {Target | Array<Target>} ts Target or array of Targets that the list should include
   */
  constructor(ts = []) {
    if (ts instanceof Target) ts = [ts];
    if (!(ts instanceof Array)) throw new Error(`Cannot build target list without a valid argument:\n${ts}`);

    this.array = ts;
  }

  /**
   * add - add a Target to the list
   *
   * @param  {string} name    The name of the target, only for debug purposes
   * @param  {string} id      The id of the target
   * @param  {number} minutes The minutes that the bot should wait to recheck
   * @returns {Target | string}
   */
  add(name = "", id = "", minutes) {
    if (name == "") name = `Manual (${new Date()})`;
    let curr = new Target(name, id, minutes);
    if (curr.err == null) {
      this.array.push(curr);
      return curr;
    } else return curr.err;
  }

  /**
   * get - gets a Target by id
   *
   * @param  {string} id The target's id
   * @returns {?Target} The resulting Target, if it found one
   */
  get(id = "") {
    for (let t of this.array) {
      if (t.id == id) return t;
    }
  }

  /**
   * remove - removes a target from the list
   *
   * @param  {Target | string} target Either the target to remove or its ID
   */
  remove(target) {
    if (isID(target)) target = this.get(target);
    if (!(target instanceof Target)) console.error("Cannot remove an invalid target.");
    else
      for (let t of this.array) {
        if (t == target) {
          this.array.splice(this.array.indexOf(target), 1);
        }
      }
  }
}

/**
 * listFromSettings - create a TargetList from the settings.json file
 *
 * @param  {Array<Array>} arr The target form
 * @returns {TargetList} The resulting list
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

module.exports = (settings) => {
  return {
    commands: settings.commands,
    guild: settings.guild,
    loop: settings.ms, //ms
    owner: settings.owner,
    status: settings.status,
    watched: listFromSettings(settings.list)
  };
};