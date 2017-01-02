(function() {
  var App, Compare, Hotentry, router;

  router = new VueRouter();

  Hotentry = {
    template: "#hotentry",
    props: ["a", "b"],
    data: function() {
      return {
        entries: []
      };
    },
    created: function() {
      return $.getJSON("/hatedup/hotentry.json", (function(_this) {
        return function(json) {
          return _this.entries = json;
        };
      })(this));
    },
    methods: {
      updateA: function(value) {
        return this.$dispatch("updateA", value);
      },
      updateB: function(value) {
        return this.$dispatch("updateB", value);
      }
    }
  };

  Compare = {
    template: "#compare",
    props: ["a", "b"],
    data: function() {
      return {
        entryA: false,
        entryB: false,
        filter: "",
        filtered: "",
        loadingA: false,
        loadingB: false,
        allA: false,
        allB: false
      };
    },
    route: {
      data: function() {
        this.a = this.$route.query.a;
        this.b = this.$route.query.b;
        this.allA = this.$route.query.allA === "true" ? true : false;
        this.allB = this.$route.query.allB === "true" ? true : false;
        this.filter = this.$route.query.filter;
        this.$dispatch("update", this.a, this.b);
        this.filtered = this.filter;
        return this.compare();
      }
    },
    watch: {
      filtered: function() {
        return router.go({
          path: "/compare",
          query: {
            a: this.a,
            b: this.b,
            allA: this.allA,
            allB: this.allB,
            filter: this.filter
          }
        });
      },
      allA: function() {
        return router.go({
          path: "/compare",
          query: {
            a: this.a,
            b: this.b,
            allA: this.allA,
            allB: this.allB,
            filter: this.filtered
          }
        });
      },
      allB: function() {
        return router.go({
          path: "/compare",
          query: {
            a: this.a,
            b: this.b,
            allA: this.allA,
            allB: this.allB,
            filter: this.filtered
          }
        });
      }
    },
    computed: {
      bookmarks: function() {
        var bookmarks, compact, entryA, entryB;
        if (!(this.entryA && this.entryA.bookmarks && this.entryB && this.entryB.bookmarks)) {
          return [];
        }
        compact = function(entry) {
          entry.bookmarks = entry.bookmarks.filter(function(bookmark) {
            return bookmark.comment;
          });
          return entry;
        };
        entryA = compact(this.entryA).bookmarks;
        entryB = compact(this.entryB).bookmarks;
        if (this.allA && this.allB) {
          return entryA.concat(entryB).map((function(_this) {
            return function(bookmark) {
              var bookmarkA, bookmarkB;
              bookmarkA = entryA.find(function(bookmarkA) {
                return bookmarkA.user === bookmark.user;
              });
              bookmarkB = entryB.find(function(bookmarkB) {
                return bookmarkB.user === bookmark.user;
              });
              if (bookmarkA && bookmarkB) {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              } else if (bookmarkA) {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmark.user,
                    comment: "",
                    timestamp: false
                  }
                };
              } else if (bookmarkB) {
                return {
                  a: {
                    user: bookmark.user,
                    comment: "",
                    timestamp: false
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              }
            };
          })(this));
        } else if (this.allA) {
          return entryA.map((function(_this) {
            return function(bookmarkA) {
              var bookmarkB;
              bookmarkB = entryB.find(function(bookmarkB) {
                return bookmarkA.user === bookmarkB.user;
              });
              if (bookmarkB) {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              } else {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmarkA.user,
                    comment: "",
                    timestamp: false
                  }
                };
              }
            };
          })(this));
        } else if (this.allB) {
          return entryB.map((function(_this) {
            return function(bookmarkB) {
              var bookmarkA;
              bookmarkA = entryA.find(function(bookmarkA) {
                return bookmarkA.user === bookmarkB.user;
              });
              if (bookmarkA) {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              } else {
                return {
                  a: {
                    user: bookmarkB.user,
                    comment: "",
                    timestamp: false
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              }
            };
          })(this));
        } else {
          bookmarks = entryA.map((function(_this) {
            return function(bookmarkA) {
              var bookmarkB;
              bookmarkB = entryB.find(function(bookmarkB) {
                return bookmarkA.user === bookmarkB.user;
              });
              if (bookmarkB && bookmarkA.comment && bookmarkB.comment) {
                return {
                  a: {
                    user: bookmarkA.user,
                    comment: bookmarkA.comment,
                    timestamp: bookmarkA.timestamp
                  },
                  b: {
                    user: bookmarkB.user,
                    comment: bookmarkB.comment,
                    timestamp: bookmarkB.timestamp
                  }
                };
              }
            };
          })(this));
          return bookmarks.filter(function(bookmark) {
            return bookmark;
          });
        }
      }
    },
    methods: {
      compare: function() {
        var jsonp;
        jsonp = function(url) {
          return "https://b.hatena.ne.jp/entry/jsonlite/?url=" + url + "&callback=?";
        };
        this.entryA = false;
        this.loadingA = true;
        $.ajax({
          url: jsonp(this.a),
          dataType: "jsonp",
          cache: true
        }).done((function(_this) {
          return function(response) {
            return _this.entryA = response;
          };
        })(this)).always((function(_this) {
          return function() {
            return _this.loadingA = false;
          };
        })(this));
        this.entryB = false;
        this.loadingB = true;
        return $.ajax({
          url: jsonp(this.b),
          dataType: "jsonp",
          cache: true
        }).done((function(_this) {
          return function(response) {
            return _this.entryB = response;
          };
        })(this)).always((function(_this) {
          return function() {
            return _this.loadingB = false;
          };
        })(this));
      },
      setFilter: function() {
        return this.filtered = this.filter;
      },
      comments: function(bookmarks) {
        if (bookmarks && bookmarks.length) {
          return bookmarks.filter(function(bookmark) {
            return bookmark.comment;
          });
        } else {
          return [];
        }
      }
    }
  };

  App = Vue.extend({
    data: function() {
      return {
        a: "",
        b: ""
      };
    },
    events: {
      update: function(a, b) {
        this.a = a;
        return this.b = b;
      },
      updateA: function(a) {
        return this.a = a;
      },
      updateB: function(b) {
        return this.b = b;
      }
    },
    methods: {
      compare: function() {
        return router.go({
          path: "/compare",
          query: {
            a: this.a,
            b: this.b
          }
        });
      },
      exchange: function() {
        var a;
        a = this.a;
        this.a = this.b;
        this.b = a;
        return this.compare();
      }
    }
  });

  router.map({
    '/': {
      component: Hotentry
    },
    '/compare': {
      component: Compare
    }
  });

  router.start(App, "#app");

}).call(this);
