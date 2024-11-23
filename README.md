# instance-creator
A simple Terraform project to launch an Dynamic EC2 instance on AWS with SSH and security group configuration


A Node.js application to create AWS EC2 instances with customizable parameters like instance type, AMI ID, disk size, and instance name. The application includes vCPU quota validation to ensure that the number of requested instances does not exceed the AWS account's available quota.

Features Create EC2 Instances: Supports creating one or multiple EC2 instances with specified configurations. Customizable Parameters: Instance name, type, disk size, and AMI ID can be defined dynamically. vCPU Quota Validation: Checks available vCPU quota and prevents exceeding limits. Interactive Form: User-friendly interface for inputting configuration details. Error Handling: Handles errors related to AWS SDK, such as insufficient quotas or invalid credentials. Prerequisites Before running this project, ensure you have:

AWS Account: With access to EC2 services. AWS IAM User: Access and secret keys with permissions to create EC2 instances. Node.js: Installed on your system (v14 or higher recommended). AWS CLI (optional): To manage AWS resources directly from the command line. Installation Clone the repository:

bash Copy code git clone https://github.com/your-username/aws-ec2-instance-creator.git cd aws-ec2-instance-creator Install dependencies:

bash Copy code npm install Set up your AWS region:

Update AWS.config.update({ region: 'your-region' }); in the server.js file with your preferred AWS region. Usage Start the server:

bash Copy code node server.js Access the application: Open your browser and go to http://localhost:3002.

Fill in the form:

Enter your AWS credentials, instance configuration details, and click Create Instance. View response:

If successful, the instance ID(s) will be displayed. If an error occurs, a descriptive message will be shown. Project Structure php Copy code aws-ec2-instance-creator/ │
├── public/ # Frontend assets │
├── index.html # Main HTML form
│ └── style.css # Optional styling for the form │
├── server.js # Backend server with AWS EC2 logic
├── package.json # Dependencies and project metadata 
└── README.md # Project documentation Example Workflow Fill out the form with:

AWS Access Key and Secret Key Instance Name Number of Instances Instance Type (e.g., t2.micro) AMI ID (e.g., ami-12345678) Disk Size (in GB) Submit the form.

Instances will be created on AWS EC2 and tagged with the specified name.

Limitations The application only supports AWS EC2 instances in a single region at a time. Ensure your IAM user has the required permissions (e.g., ec2:RunInstances, servicequotas:GetServiceQuota). Contributing Contributions are welcome! Feel free to:

Fork the repository Create a feature branch Submit a pull request License This project is licensed under the MIT License. See the LICENSE file for more details.

Contact If you have any questions or feedback, feel free to reach out:

