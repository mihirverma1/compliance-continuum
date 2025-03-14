
# ComplianceCore GRC Platform

A comprehensive Governance, Risk Management, and Compliance (GRC) platform designed for organizations to manage their regulatory compliance needs effectively.

## Project Overview

ComplianceCore is a web-based GRC solution that helps organizations manage their compliance frameworks, risk assessments, policies, and audits in one centralized platform.

## Key Features

1. **Dashboard**
   - Compliance status overview
   - Risk summary visualization
   - Recent activities tracker
   - Key metrics and statistics

2. **Compliance Management**
   - Support for multiple frameworks (ISO 27001, PCI DSS, HIPAA, SOC 2)
   - Control mapping and evidence management
   - Compliance status tracking
   - Gap analysis and remediation planning

3. **Risk Management**
   - Risk register with assessment capabilities
   - Risk heatmaps and visualization
   - Threat management
   - Mitigation planning

4. **Policy & Audit Management**
   - Document library for policies and procedures
   - Version control and approval workflows
   - Audit planning and execution
   - Findings and observations tracking

5. **Asset Inventory**
   - IT asset tracking and management
   - Compliance status mapping to assets
   - Department attribution
   - Criticality classification

6. **User Management**
   - Role-based access control (RBAC)
   - Department-based permissions
   - User activity monitoring
   - Account provisioning and deprovisioning

7. **System Settings**
   - General configuration
   - Security settings and password policies
   - Notification preferences
   - Integration management
   - Backup and log management

## Implementation Details

### Authentication System

- Basic username/password authentication
- Demo credentials:
  - Username: `miko`
  - Password: `miko`
- Role-based access with predefined roles:
  - Admin: Full system access
  - Auditor: Read-only access to compliance data
  - User: Limited access to assigned modules

### Compliance Module

- Framework setup for ISO 27001, PCI DSS, HIPAA, and SOC 2
- Control categories and individual controls management
- Evidence upload and association with controls
- Compliance scoring and visual indicators
- Framework-specific dashboards

### Risk Management Module

- Risk assessment methodology
- Customizable risk matrices
- Risk treatment planning
- Mitigation tracking
- Integrated with compliance frameworks

### Policy & Audit Module

- Policy document management
- Audit planning and scheduling
- Audit evidence collection
- Findings and observations tracking
- Remediation assignment

### Asset Inventory Module

- Asset catalog with detailed information
- Department assignment
- Compliance status tracking
- Criticality assessment
- Integration with risk and compliance modules

### User Access & Settings

- User account management
- Role and permission configuration
- Department-based segregation
- System settings and configuration
- Backup and restore capabilities

## On-Premises Deployment

For organizations requiring on-premises deployment, follow these steps:

1. **System Requirements**
   - Node.js (v16+)
   - NPM (v8+)
   - Docker (optional, for containerization)
   - Database: MySQL, PostgreSQL, or MongoDB
   - Storage: Minimum 50GB for application and data

2. **Installation**
   ```sh
   # Clone the repository
   git clone <repository-url>
   
   # Install dependencies
   npm install
   
   # Build the application
   npm run build
   
   # Start the server
   npm run start
   ```

3. **Configuration**
   - Set up your database connection
   - Configure authentication services
   - Set email notification parameters
   - Adjust backup settings
   - Establish system logging

4. **Data Migration**
   - Import existing compliance data if available
   - Set up initial user accounts and permissions
   - Configure initial compliance frameworks
   - Import asset inventory

5. **Security Hardening**
   - Enable HTTPS with valid certificates
   - Implement proper network segmentation
   - Configure firewall rules
   - Set up regular security scanning
   - Enable audit logging

6. **High Availability (Optional)**
   - Set up load balancing
   - Configure database replication
   - Implement automated backups
   - Establish disaster recovery procedures

## Integration Capabilities

ComplianceCore supports integration with:
- Identity providers (Azure AD, LDAP)
- Ticketing systems (Jira, ServiceNow)
- Communication tools (Slack, MS Teams)
- Cloud providers (AWS, Azure, GCP)
- Development tools (GitHub, GitLab)

## License

This project is licensed under the terms of the MIT license.

## Development

This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- TanStack Query
