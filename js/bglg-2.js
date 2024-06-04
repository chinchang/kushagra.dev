(function () {
  /**
   * Commit class
   * A single commit.
   *
   * @param {number} id  		 ID of commit.
   * @param {Commit} parent	 Parent Commit.
   * @param {string} msg 		 Commit message.
   */
  function Commit(id, parent, message) {
    this.id = id;
    this.parent = parent;
    this.message = message;
  }

  /**
   * Git class
   * Represents a Git repository.
   *
   * @param {string} name Repository name.
   */
  function Git(name) {
    this.name = name; // Repo name
    this.lastCommitId = -1; // Keep track of last commit id.
    this.HEAD = null; // Reference to last Commit.
  }

  /**
   * Make a commit.
   * @param  {string} message Commit message.
   * @return {Commit}         Created commit object.
   */
  Git.prototype.commit = function (message) {
    // Increment last commit id and pass into new commit.
    var commit = new Commit(++this.lastCommitId, this.HEAD, message);

    // Update HEAD and current branch.
    this.HEAD = commit;

    return commit;
  };

  /**
   * Logs history.
   * @return {Array} Commits in reverse chronological order.
   */
  Git.prototype.log = function () {
    // Start from HEAD
    var commit = this.HEAD,
      history = [];

    while (commit) {
      history.push(commit);
      // Keep following the parent
      commit = commit.parent;
    }

    return history;
  };

  // Expose Git class on window.
  window.Git = Git;
})();

// Test #1
var repo = new Git("test");
repo.commit("Initial commit");
repo.commit("Change 1");

var log = repo.log();
console.assert(log.length === 2); // Should have 2 commits.
console.assert(!!log[0] && log[0].id === 1); // Commit 1 should be first.
console.assert(!!log[1] && log[1].id === 0); // And then Commit 0.
