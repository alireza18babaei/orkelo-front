import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const TermsModal = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size='lg' scrollable centered>
      <ModalHeader toggle={toggle}>Terms & Conditions</ModalHeader>

      <ModalBody
        style={{ maxHeight: '70vh', overflowY: 'auto', lineHeight: '1.9' }}
      >
        <p>
          <strong>Last updated:</strong> April 10, 2026
        </p>

        <h5>1. Introduction</h5>
        <p>
          Welcome to Orkelo. These Terms & Conditions (“Terms”) govern your
          access to and use of the Orkelo platform, including all features,
          services, and applications provided by Orkelo (“Service”). By
          accessing or using Orkelo, you agree to be bound by these Terms. If
          you do not agree, you may not use the Service.
        </p>

        <h5>2. Definitions</h5>
        <ul>
          <li>“Orkelo” refers to the software platform and its operators.</li>
          <li>“User” refers to any individual or entity using the Service.</li>
          <li>“Account” refers to a registered user profile.</li>
          <li>“Project” refers to a workspace where users collaborate.</li>
          <li>
            “Content” refers to all data, files, documents, tasks, and
            information uploaded or created within the platform.
          </li>
        </ul>

        <h5>3. Account Registration</h5>
        <ul>
          <li>Users must provide accurate and complete information.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>You are responsible for all activities under your account.</li>
          <li>
            Orkelo reserves the right to suspend or terminate accounts that
            violate these Terms.
          </li>
        </ul>

        <h5>4. Use of the Service</h5>
        <p>You agree to use Orkelo only for lawful purposes.</p>
        <p>You may not:</p>
        <ul>
          <li>Use the platform for illegal or unauthorized activities</li>
          <li>Interfere with system security or performance</li>
          <li>Attempt to gain unauthorized access to other accounts or data</li>
          <li>Upload harmful, malicious, or abusive content</li>
        </ul>

        <h5>5. Projects and Collaboration</h5>
        <ul>
          <li>Users can be added to one or more projects.</li>
          <li>
            Access to projects and content is controlled by user permissions and
            visibility settings.
          </li>
          <li>
            Users are responsible for managing access rights within their
            projects.
          </li>
          <li>
            Orkelo is not responsible for unintended access caused by
            user-configured visibility settings.
          </li>
        </ul>

        <h5>6. Content Ownership</h5>
        <ul>
          <li>Users retain full ownership of their Content.</li>
          <li>
            By uploading Content, you grant Orkelo a limited license to store,
            process, and display the Content solely to provide the Service.
          </li>
          <li>Orkelo does not claim ownership over user Content.</li>
        </ul>

        <h5>7. Data Visibility & Privacy</h5>
        <ul>
          <li>
            Content visibility within projects is controlled by features such
            as:
          </li>
          <li>Assigned users</li>
          <li>Visibility settings</li>
          <li>Exclusion settings</li>
          <li>Orkelo provides tools to manage visibility, but:</li>
          <li>
            Users are responsible for configuring these settings correctly
          </li>
          <li>Orkelo is not liable for visibility misconfigurations</li>
        </ul>

        <h5>8. Document Storage & Files</h5>
        <ul>
          <li>
            Orkelo provides document storage and management functionality.
          </li>
          <li>
            Users are responsible for ensuring that uploaded files comply with
            applicable laws.
          </li>
          <li>Orkelo may impose storage limits or usage restrictions.</li>
        </ul>

        <h5>9. Availability of Service</h5>
        <ul>
          <li>
            Orkelo aims to provide reliable access but does not guarantee
            uninterrupted availability.
          </li>
          <li>
            Maintenance, updates, or technical issues may cause temporary
            downtime.
          </li>
        </ul>

        <h5>10. Subscription & Payments (if applicable)</h5>
        <ul>
          <li>Certain features may require payment.</li>
          <li>
            Subscription terms, pricing, and billing cycles will be communicated
            separately.
          </li>
          <li>Failure to pay may result in restricted access or suspension.</li>
        </ul>

        <h5>11. Termination</h5>
        <p>Orkelo may suspend or terminate your account if:</p>
        <ul>
          <li>You violate these Terms</li>
          <li>You misuse the platform</li>
          <li>Required payments are not made</li>
        </ul>
        <p>Users may stop using the Service at any time.</p>

        <h5>12. Limitation of Liability</h5>
        <p>To the maximum extent permitted by law:</p>
        <ul>
          <li>Orkelo is provided “as is”</li>
          <li>Orkelo is not liable for:</li>
          <li>Data loss</li>
          <li>Business interruption</li>
          <li>Unauthorized access due to user misconfiguration</li>
          <li>Indirect or consequential damages</li>
        </ul>

        <h5>13. Intellectual Property</h5>
        <ul>
          <li>
            The Orkelo platform, including its design, code, and branding, is
            the property of Orkelo.
          </li>
          <li>
            Users may not copy, modify, or distribute the platform without
            permission.
          </li>
        </ul>

        <h5>14. Changes to the Terms</h5>
        <p>
          Orkelo may update these Terms at any time. Users will be notified of
          significant changes. Continued use of the Service constitutes
          acceptance of the updated Terms.
        </p>

        <h5>15. Governing Law</h5>
        <p>
          These Terms are governed by the laws of the applicable jurisdiction in
          which Orkelo operates.
        </p>

        <h5>16. Contact</h5>
        <p>For questions regarding these Terms, please contact:</p>
        <p>[Insert Company Email Address]</p>

        <h5>17. Final Provisions</h5>
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable, the remaining provisions will remain in full force.
        </p>
      </ModalBody>

      <ModalFooter>
        <Button color='secondary' onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TermsModal;
