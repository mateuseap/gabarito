// AWS Certified Cloud Practitioner (CLF-C02) practice questions.
// Domains and weights follow the official exam guide: Cloud Concepts 24%,
// Security and Compliance 30%, Cloud Technology and Services 34%,
// Billing, Pricing, and Support 12%. Each 20-question set keeps that mix
// (5 / 6 / 7 / 2). Questions are original and in English, like the exam.

// the real exam has four options per question: the key plus three distractors
const q = (topico, enunciado, certa, erradas, explicacao) => ({ topico, enunciado, certa, erradas: erradas.slice(0, 3), explicacao });

export const CONCEITOS = [
  [
    q('Cloud value proposition', 'Which advantage of cloud computing lets a company stop guessing how much infrastructure it will need?', 'Elasticity: scale capacity up and down as demand changes.', ['Trading variable expense for capital expense.', 'Owning dedicated physical servers in each Region.', 'Signing long hardware contracts at a discount.', 'Running everything in a single Availability Zone.'], 'Elasticity means you provision for actual demand instead of forecasting peak capacity in advance.'),
    q('Cloud value proposition', 'A startup wants to avoid large upfront hardware purchases. Which cloud benefit addresses this?', 'Trade fixed capital expense for variable expense.', ['Increase speed by owning data centers.', 'Benefit from higher hardware prices.', 'Lock in multi-year hardware contracts.', 'Run workloads only on premises.'], 'With the cloud you pay only for what you use instead of buying servers upfront.'),
    q('Well-Architected Framework', 'Which pillar of the AWS Well-Architected Framework focuses on the ability of a workload to recover from failures?', 'Reliability', ['Cost Optimization', 'Performance Efficiency', 'Sustainability', 'Operational Excellence'], 'Reliability covers recovering from disruptions and meeting demand, such as using Multi-AZ deployments.'),
    q('Global infrastructure', 'What is an AWS Availability Zone?', 'One or more discrete data centers with redundant power and networking within a Region.', ['A geographic area that contains several Regions.', 'A content delivery cache location.', 'A single physical server.', 'A virtual network for one customer.'], 'A Region contains multiple isolated Availability Zones; each AZ is one or more data centers.'),
    q('Migration strategies', 'A company moves an application to Amazon EC2 without changing its code. Which migration strategy is this?', 'Rehost ("lift and shift")', ['Refactor', 'Retire', 'Repurchase', 'Replatform'], 'Rehosting moves the application as is, without code changes.'),
  ],
  [
    q('Cloud value proposition', 'Deploying an application in multiple AWS Regions around the world in minutes illustrates which benefit?', 'Go global in minutes.', ['Stop spending money on data centers.', 'Trade variable for capital expense.', 'Benefit from massive economies of scale only.', 'Increase hardware maintenance.'], 'AWS global infrastructure lets you deploy closer to users worldwide with a few clicks.'),
    q('Deployment models', 'A company runs some workloads on AWS and keeps others in its own data center, connected together. Which deployment model is this?', 'Hybrid', ['Public cloud only', 'Private cloud only', 'Multi-AZ', 'Edge-only'], 'Hybrid deployment connects on-premises infrastructure with cloud resources.'),
    q('Well-Architected Framework', 'Which Well-Architected pillar recommends using managed services and right-sizing to avoid paying for unused resources?', 'Cost Optimization', ['Security', 'Reliability', 'Operational Excellence', 'Performance Efficiency'], 'Cost Optimization is about delivering value at the lowest price point, including right-sizing.'),
    q('Global infrastructure', 'Which AWS infrastructure component caches content close to end users to reduce latency?', 'Edge locations', ['Availability Zones', 'Regions', 'VPC subnets', 'Placement groups'], 'Edge locations host Amazon CloudFront caches near users.'),
    q('Cloud Adoption Framework', 'In the AWS Cloud Adoption Framework (AWS CAF), which perspective focuses on skills, training and organizational change?', 'People', ['Platform', 'Security', 'Operations', 'Governance'], 'The People perspective addresses culture, roles and training during cloud adoption.'),
  ],
];

export const SEGURANCA = [
  [
    q('Shared responsibility', 'Under the AWS shared responsibility model, which task is the customer responsible for on Amazon EC2?', 'Patching the guest operating system.', ['Maintaining the physical hosts.', 'Securing the data center building.', 'Replacing failed hard drives.', 'Managing the hypervisor.'], 'AWS handles security "of" the cloud; customers handle security "in" the cloud, including the EC2 guest OS.'),
    q('IAM', 'What is the AWS best practice for the root user of an account?', 'Enable MFA and use it only for tasks that require root.', ['Use it for daily administration.', 'Share its credentials with the team.', 'Create access keys for it.', 'Delete it after creating the account.'], 'Protect the root user with MFA and use IAM identities for everyday work.'),
    q('IAM', 'Which principle says users should get only the permissions they need to do their job?', 'Least privilege', ['Defense in depth', 'Separation of Regions', 'Elasticity', 'High availability'], 'Least privilege limits each identity to the minimum permissions required.'),
    q('Security services', 'Which AWS service helps protect web applications against common exploits like SQL injection?', 'AWS WAF', ['Amazon Inspector', 'AWS Artifact', 'Amazon Macie', 'AWS Config'], 'AWS WAF is a web application firewall that filters malicious HTTP requests.'),
    q('Compliance', 'Where can a customer download AWS compliance reports such as SOC and ISO certifications?', 'AWS Artifact', ['AWS Trusted Advisor', 'Amazon GuardDuty', 'AWS Shield', 'AWS CloudTrail'], 'AWS Artifact provides on-demand access to AWS security and compliance reports.'),
    q('Security services', 'Which service records API calls made in an AWS account for auditing?', 'AWS CloudTrail', ['Amazon CloudWatch', 'AWS Config', 'Amazon Inspector', 'AWS Shield'], 'CloudTrail logs who made which API call, when and from where.'),
  ],
  [
    q('Shared responsibility', 'For Amazon RDS, which responsibility belongs to AWS?', 'Patching the database engine software.', ['Managing database user permissions.', 'Choosing which data to store.', 'Configuring security group rules.', 'Classifying sensitive data.'], 'RDS is managed: AWS patches the engine and OS, while the customer manages access and data.'),
    q('IAM', 'An application on EC2 needs to read objects from Amazon S3. What is the most secure way to grant access?', 'Attach an IAM role to the EC2 instance.', ['Store access keys in the application code.', 'Make the S3 bucket public.', 'Use the root user credentials.', 'Email the keys to the developers.'], 'IAM roles provide temporary credentials without hard-coding long-term keys.'),
    q('Security services', 'Which service uses machine learning to continuously detect threats like unusual API activity?', 'Amazon GuardDuty', ['AWS WAF', 'AWS Artifact', 'Amazon Macie', 'AWS Organizations'], 'GuardDuty analyzes logs such as CloudTrail and VPC Flow Logs to detect threats.'),
    q('Security services', 'Which AWS service provides managed protection against DDoS attacks, included at no extra cost for all customers?', 'AWS Shield Standard', ['AWS Shield Advanced', 'Amazon Inspector', 'AWS KMS', 'Amazon Detective'], 'Shield Standard is automatically enabled at no additional cost; Shield Advanced is paid.'),
    q('Data protection', 'Which service creates and manages encryption keys used by many AWS services?', 'AWS Key Management Service (AWS KMS)', ['AWS Secrets Manager', 'Amazon Cognito', 'AWS Certificate Manager', 'AWS IAM Identity Center'], 'KMS manages cryptographic keys and integrates with S3, EBS, RDS and others.'),
    q('Security services', 'Which service discovers and protects sensitive data such as personal information stored in Amazon S3?', 'Amazon Macie', ['Amazon GuardDuty', 'AWS Config', 'Amazon Inspector', 'AWS Shield'], 'Macie uses machine learning to find and classify sensitive data in S3.'),
  ],
];

export const TECNOLOGIA = [
  [
    q('Compute', 'Which service runs code without provisioning or managing servers and charges per request and execution time?', 'AWS Lambda', ['Amazon EC2', 'Amazon Lightsail', 'AWS Outposts', 'Amazon EBS'], 'Lambda is serverless compute billed by invocations and duration.'),
    q('Storage', 'Which storage service offers object storage with 11 nines of durability?', 'Amazon S3', ['Amazon EBS', 'Amazon EFS', 'Instance store', 'AWS Storage Gateway'], 'Amazon S3 is designed for 99.999999999% durability of objects.'),
    q('Storage', 'Which S3 storage class is the lowest cost for archives that are rarely accessed and can wait hours to be retrieved?', 'S3 Glacier Deep Archive', ['S3 Standard', 'S3 Intelligent-Tiering', 'S3 Standard-IA', 'S3 One Zone-IA'], 'Glacier Deep Archive is the cheapest class, with retrieval within hours.'),
    q('Databases', 'Which fully managed NoSQL key-value database delivers single-digit millisecond performance at any scale?', 'Amazon DynamoDB', ['Amazon RDS for MySQL', 'Amazon Redshift', 'Amazon Aurora', 'Amazon Neptune'], 'DynamoDB is a serverless key-value and document database.'),
    q('Networking', 'Which service lets you launch AWS resources in a logically isolated virtual network that you define?', 'Amazon VPC', ['Amazon Route 53', 'AWS Direct Connect', 'Amazon CloudFront', 'Elastic Load Balancing'], 'A VPC is your private, isolated network in AWS.'),
    q('Networking', 'Which service provides a dedicated private network connection from on premises to AWS?', 'AWS Direct Connect', ['AWS Site-to-Site VPN', 'Amazon CloudFront', 'Amazon Route 53', 'AWS Global Accelerator'], 'Direct Connect is a dedicated physical link, not over the public internet.'),
    q('Monitoring', 'Which service collects metrics and logs and can trigger alarms when a threshold is crossed?', 'Amazon CloudWatch', ['AWS CloudTrail', 'AWS Config', 'AWS Artifact', 'AWS X-Ray'], 'CloudWatch monitors metrics, logs and alarms for AWS resources.'),
  ],
  [
    q('Compute', 'Which EC2 purchasing option offers the largest discount for fault-tolerant workloads that can be interrupted?', 'Spot Instances', ['On-Demand Instances', 'Dedicated Hosts', 'Reserved Instances', 'Capacity Reservations'], 'Spot uses spare capacity at up to 90% off, but AWS can reclaim it.'),
    q('Compute', 'Which service automatically adjusts the number of EC2 instances based on demand?', 'Amazon EC2 Auto Scaling', ['Elastic Load Balancing', 'AWS Elastic Beanstalk', 'Amazon CloudFront', 'AWS Batch'], 'Auto Scaling adds or removes instances to match load.'),
    q('Storage', 'Which storage is a block-level volume attached to a single EC2 instance?', 'Amazon EBS', ['Amazon S3', 'Amazon EFS', 'Amazon S3 Glacier', 'AWS Snowball'], 'EBS provides persistent block storage for EC2.'),
    q('Databases', 'Which service is a data warehouse optimized for analytics on large datasets?', 'Amazon Redshift', ['Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon RDS', 'Amazon DocumentDB'], 'Redshift is a petabyte-scale data warehouse for analytics.'),
    q('Networking', 'Which service is a highly available DNS web service?', 'Amazon Route 53', ['Amazon VPC', 'Amazon CloudFront', 'AWS Direct Connect', 'Elastic Load Balancing'], 'Route 53 provides DNS and domain registration.'),
    q('Application integration', 'Which service is a fully managed message queue that decouples application components?', 'Amazon SQS', ['Amazon SNS', 'Amazon Kinesis', 'AWS Step Functions', 'Amazon MQ'], 'SQS queues messages so producers and consumers work independently.'),
    q('Machine learning', 'Which service lets developers build, train and deploy machine learning models?', 'Amazon SageMaker AI', ['Amazon Polly', 'Amazon Rekognition', 'Amazon Lex', 'Amazon Translate'], 'SageMaker AI covers the full ML workflow; the others are ready-made AI services.'),
  ],
];

export const COBRANCA = [
  [
    q('Pricing', 'Which tool estimates the monthly cost of a planned architecture before deploying it?', 'AWS Pricing Calculator', ['AWS Cost Explorer', 'AWS Budgets', 'AWS Artifact', 'AWS Trusted Advisor'], 'The Pricing Calculator estimates costs for services you have not launched yet.'),
    q('Support', 'Which AWS Support plan is the lowest-cost plan that includes a designated Technical Account Manager (TAM)?', 'Enterprise', ['Basic', 'Developer', 'Business', 'Enterprise On-Ramp'], 'Enterprise includes a designated TAM; Enterprise On-Ramp offers a pool of TAMs instead.'),
  ],
  [
    q('Cost management', 'Which service sends an alert when actual or forecasted costs exceed a threshold you define?', 'AWS Budgets', ['AWS Cost Explorer', 'AWS Pricing Calculator', 'AWS Organizations', 'Amazon CloudWatch Logs'], 'AWS Budgets tracks spend and notifies you when thresholds are crossed.'),
    q('Account structures', 'Which feature of AWS Organizations combines the bills of multiple accounts and can lower costs with volume discounts?', 'Consolidated billing', ['Service control policies', 'IAM Identity Center', 'AWS Control Tower', 'Cost allocation tags'], 'Consolidated billing aggregates usage across accounts, which can unlock volume pricing tiers.'),
  ],
];
