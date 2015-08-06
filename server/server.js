Future = Npm.require('fibers/future');

Meteor.methods({
    'getInstragramPics': function (lat, lng) {
        var future = new Future;

        var params = {
            client_id: "2ad207994fcc4372bd413099883cefb2"
        };

        var url = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&distance=3000&count=20';

        var response = HTTP.get(url, {
            params: params
        });

        if(response) {
            future.return(response);
        }

        return future.wait();
    }
});