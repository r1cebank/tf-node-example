const grpc = require('grpc');
// const image_data = require('./test/fixtures/image');
var mnist = require('mnist');

var tensorflow_serving = grpc.load('protos/prediction_service.proto').tensorflow.serving;
var client = new tensorflow_serving.PredictionService('192.168.33.10:9000', grpc.credentials.createInsecure());

var image_data = mnist[0].get();

var message = {
    model_spec: {
        name: "mnist",
        signature_name: "predict_images"
    },
    inputs: {
        images: {
            dtype: "DT_FLOAT",
            tensor_shape: {
                dim: [{
                        size: 1
                    },
                    {
                        size: image_data.length
                    }
                ]
            },
            float_val: image_data
        }
    }
};

function run() {
    client.predict(message, (err, mnistResponse) => {
        if (err) {
            console.log(err)
        } else {
            const score = mnistResponse.outputs.scores.float_val;
            console.log(score.indexOf(Math.max(...score)));
        }
    });
};

run();
