function sortMe(cb, sort) {
      Models.contents.findAll({
          include: [{
              model: Models.votes,
          }, {
              model: Models.users
          }],
          group: 'contents.id',
          attributes: {
              include: [
                  [Sequelize.fn('SUM', Sequelize.col('votes.upVote')), 'voteScore']
              ]
          },
          order: [Sequelize.literal(sort ' DESC')],
          limit: 25,
          subQuery: false
      }).then(function(results) {
          cb(results);
      });
  }

app.get('/sort/:sort', function(request, response) {
      if (request.params.sort === 'new'){
          sortMe(function(results) {
              var html = buildHTMLlist(results);
              response.send(html)
          }, "createdAt")
      }
      else if (request.params.sort === 'top'){
          sortMe(function(results){
              var html = buildHTMLlist(results);
              response.send(html)
          }, "voteScore")
      }
      // else if (request.params.sort === 'hot'){
      //     sortMe(function(results){
      //         var html = buildHTMLlist(results);
      //         response.send(html)
      //     }, '(datediff(now(), createdAt))')
      // }
      else if (request.params.sort === '/'){
          sortMe(function(results){
              var html = buildHTMLlist(results);
              response.send(html)
          }, 'createdAt')
      }
  })