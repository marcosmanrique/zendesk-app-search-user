(function() {

  return {
    events: {
      'click .search_user_bt': 'getUserInfo',
      // Requests
      'getUserInfoRequest.done': 'handleUserData',
      'getUserInfoRequest.fail' : 'fail'

    },

    requests: {
      getUserInfoRequest: function(id) {
        return { url: helpers.fmt('/api/v2/users/%@.json', id) };
      }
    },

    getUserInfo: function(event) {
      // Prevent what would normally happen when a user clicks
      event.preventDefault();
      var id = this.$('.id').first().val();
      this.ajax('getUserInfoRequest', id);
      this.switchTo('loading_screen');
    },

    fail: function(data) {
      services.notify('User not found!');
      this.switchTo('blank');
    },

    handleUserData: function(data) {
      var strLastLogin = '';
      var lastLogin = new Date(data.user.last_login_at);
      var difference = Math.abs(new Date() - lastLogin);
      var dayMilliseconds = 86400000;
      var hourMilliseconds = 3600000;
      var minuteMilliseconds = 60000;
      var total = Math.round(difference/minuteMilliseconds);
      
      if (total > 1439) {
        total = Math.round(difference/dayMilliseconds);
        if (total == 1) {
          strLastLogin = total + ' day ago';
        } else {
          strLastLogin = total + ' days ago';
        }
      } else if (total > 59) {
        total = Math.round(difference/hourMilliseconds);
        if (total == 1) {
          strLastLogin = total + ' hour ago';
        } else {
          strLastLogin = total + ' hours ago';
        }
      } else {
        if (total < 2) {
          strLastLogin = '1 minute ago';
        } else {
          strLastLogin = total + ' minutes ago';
        }
      }

      var created = new Date(data.user.created_at);
      this.switchTo('user_info', {
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        created: created.getDate() + '/' + (created.getMonth()+1) + '/' + created.getFullYear(),
        last: strLastLogin
      });
    }

  };

}());
