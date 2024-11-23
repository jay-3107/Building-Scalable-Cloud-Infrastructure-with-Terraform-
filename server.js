const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the same directory as the script

// AWS Region Configuration
AWS.config.update({ region: 'us-east-1' });

// EC2 Service Instance
const ec2 = new AWS.EC2();
const serviceQuotas = new AWS.ServiceQuotas();

// Check available vCPU quota
async function checkVCpuQuota() {
  const quotaCode = 'L-1216C47A'; // vCPU quota for EC2
  const params = {
    ServiceCode: 'ec2',
    QuotaCode: quotaCode,
  };

  try {
    const result = await serviceQuotas.getServiceQuota(params).promise();
    return result.Quota.Value; // Available vCPU limit
  } catch (error) {
    console.error('Failed to retrieve vCPU quota:', error.message);
    throw new Error('Unable to check vCPU quota');
  }
}

// Route to render the form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Adjusted path to the same directory
});

// Route to handle instance creation
app.post('/create-instance', async (req, res) => {
  const {
    accessKeyId,
    secretAccessKey,
    instanceType,
    amiId,
    diskSize,
    numberOfInstances,
    instanceName,
  } = req.body;

  // Configure AWS credentials
  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  });

  try {
    // Check vCPU quota
    const availableQuota = await checkVCpuQuota();
    const vCPUsRequired = numberOfInstances * 1; // Assuming 1 vCPU per instance (adjust if needed)

    if (vCPUsRequired > availableQuota) {
      return res.status(400).json({
        error: `Quota Exceeded`,
        message: `Your account only has ${availableQuota} vCPUs available, but you requested ${vCPUsRequired}.`,
      });
    }

    // EC2 Instance parameters
    const params = {
      ImageId: amiId,
      InstanceType: instanceType,
      MinCount: 1,
      MaxCount: numberOfInstances,
      BlockDeviceMappings: [
        {
          DeviceName: '/dev/sda1',
          Ebs: {
            VolumeSize: diskSize,
          },
        },
      ],
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'Name',
              Value: instanceName,
            },
          ],
        },
      ],
    };

    // Launch instances
    ec2.runInstances(params, (err, data) => {
      if (err) {
        console.error('Failed to create instance:', err.message);
        return res.status(500).json({
          error: 'Failed to create instance',
          message: err.message,
        });
      }

      const instanceIds = data.Instances.map((instance) => instance.InstanceId);
      res.json({
        message: `Instance(s) created successfully`,
        instanceIds,
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'Error processing your request',
      message: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
