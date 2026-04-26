import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import {
  fileManagementAccessErrorSelector,
  fileManagementAccessMembersSelector,
  fileManagementAccessProbeErrorSelector,
  fileManagementAccessProbeStatusSelector,
  fileManagementAccessSaveStatusSelector,
  fileManagementAccessSelectedUserIdsSelector,
  fileManagementAccessStatusSelector,
  fileManagementCanViewSelector,
} from '../../store/FileManager/access/access.selector';
import {
  getFileManagementAccessUsers,
  probeFileManagementSectionAccess,
  updateFileManagementAccessUsers,
} from '../../store/FileManager/access/access.thunk';
import { toastError, toastSuccess } from '../../utils/sweetAlert';
import FileManagementAccessPanel from './components/FileManagementAccessPanel';
import FinancialOperationsPanel from './components/FinancialOperationsPanel';
import './manageFinance.css';

const normalizeRole = (role) => String(role ?? '').trim().toLowerCase();

const getRoleLabel = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === 'company_owner') return 'Company Owner';
  if (normalized === 'company_supervisor') return 'Company Supervisor';
  if (normalized === 'project_manager') return 'Project Manager';
  return 'Member';
};

function SummaryCard({ iconClass, title, value, caption }) {
  return (
    <Card className='manage-finance__summary-card shadow-sm border-0 h-100'>
      <Card.Body>
        <div className='manage-finance__summary-icon'>
          <i className={iconClass}></i>
        </div>
        <p className='manage-finance__summary-label'>{title}</p>
        <h3 className='manage-finance__summary-value'>{value}</h3>
        <p className='text-muted mb-0'>{caption}</p>
      </Card.Body>
    </Card>
  );
}

export default function ManageFinance() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user ?? null);
  const activeCompany = useSelector((state) => state.companyContext?.activeCompany);
  const activeCompanyId = useSelector(
    (state) =>
      state.companyContext?.activeCompanyId ??
      state.companyContext?.activeCompany?.id ??
      null,
  );

  const members = useSelector(fileManagementAccessMembersSelector);
  const selectedUserIds = useSelector(fileManagementAccessSelectedUserIdsSelector);
  const status = useSelector(fileManagementAccessStatusSelector);
  const error = useSelector(fileManagementAccessErrorSelector);
  const saveStatus = useSelector(fileManagementAccessSaveStatusSelector);
  const canView = useSelector(fileManagementCanViewSelector);
  const accessProbeStatus = useSelector(fileManagementAccessProbeStatusSelector);
  const accessProbeError = useSelector(fileManagementAccessProbeErrorSelector);

  const companyRole = normalizeRole(
    activeCompany?.membership?.role ?? user?.company_role ?? user?.user_type,
  );
  const isCompanyOwner = companyRole === 'company_owner';
  const canOpenSection = isCompanyOwner || canView;

  useEffect(() => {
    if (!activeCompanyId) return;

    if (isCompanyOwner) {
      dispatch(getFileManagementAccessUsers());
      return;
    }

    dispatch(probeFileManagementSectionAccess());
  }, [activeCompanyId, dispatch, isCompanyOwner]);

  const ownerCount = useMemo(
    () =>
      (members || []).filter(
        (member) => normalizeRole(member?.role) === 'company_owner',
      ).length,
    [members],
  );

  const activeMemberCount = useMemo(
    () =>
      (members || []).filter(
        (member) => String(member?.status ?? '').trim().toLowerCase() === 'active',
      ).length,
    [members],
  );

  const handleRefresh = () => {
    if (isCompanyOwner) {
      dispatch(getFileManagementAccessUsers());
      return;
    }

    dispatch(probeFileManagementSectionAccess());
  };

  const handleSaveAccess = async (userIds) => {
    const resultAction = await dispatch(
      updateFileManagementAccessUsers({ userIds }),
    );

    if (updateFileManagementAccessUsers.fulfilled.match(resultAction)) {
      toastSuccess('Financial section access updated');
      return;
    }

    toastError(
      resultAction.payload?.message || 'Failed to update financial access',
    );
  };

  if (!isCompanyOwner && accessProbeStatus === 'loading' && !canOpenSection) {
    return (
      <div className='manage-finance__state-screen'>
        <Spinner animation='border' />
        <span>Checking your finance access...</span>
      </div>
    );
  }

  if (!canOpenSection) {
    return (
      <div className='manage-finance__state-screen'>
        <Alert variant={accessProbeStatus === 'failed' ? 'danger' : 'warning'}>
          {accessProbeStatus === 'failed'
            ? accessProbeError?.message ||
              'Failed to verify your financial section access.'
            : 'You do not have access to this section in the active company.'}
        </Alert>
      </div>
    );
  }

  return (
    <Row className='g-4 manage-finance'>
      <Col xs={12}>
        <Card className='manage-finance__hero shadow-sm border-0'>
          <Card.Body>
            <div className='manage-finance__hero-copy'>
              <div className='d-flex flex-wrap gap-2 align-items-center mb-3'>
                <Badge bg='dark'>Finance Center</Badge>
                <Badge bg='primary'>
                  {isCompanyOwner ? 'Owner Controls Enabled' : 'Access Enabled'}
                </Badge>
                <Badge bg='light' text='dark'>
                  {activeCompany?.name || 'Active company'}
                </Badge>
              </div>

              <h2 className='mb-2'>
                {isCompanyOwner
                  ? 'Financial Section Visibility'
                  : 'Financial Operations Workspace'}
              </h2>
              <p className='mb-0'>
                {isCompanyOwner
                  ? 'Manage who can open the finance workspace and keep access tied to the current active company.'
                  : 'Create and manage financial operations, upload supporting files, and work inside the active company finance workspace.'}
              </p>
            </div>

            <div className='manage-finance__hero-meta'>
              <span className='manage-finance__hero-meta-label'>
                Your role
              </span>
              <strong>{getRoleLabel(companyRole)}</strong>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {isCompanyOwner ? (
        <>
          <Col md={4}>
            <SummaryCard
              iconClass='ph-duotone ph-users-three'
              title='Delegated Members'
              value={selectedUserIds.length}
              caption='Users selected by the owner for this section.'
            />
          </Col>
          <Col md={4}>
            <SummaryCard
              iconClass='ph-duotone ph-shield-check'
              title='Always Allowed'
              value={ownerCount}
              caption='Company owners keep access without needing selection.'
            />
          </Col>
          <Col md={4}>
            <SummaryCard
              iconClass='ph-duotone ph-buildings'
              title='Active Members'
              value={status === 'loading' ? '...' : activeMemberCount}
              caption='Only active members from the active company are listed.'
            />
          </Col>

          <Col xs={12}>
            <FileManagementAccessPanel
              members={members}
              selectedUserIds={selectedUserIds}
              loading={status === 'loading'}
              saving={saveStatus === 'loading'}
              error={error}
              onRefresh={handleRefresh}
              onSave={handleSaveAccess}
            />
          </Col>
        </>
      ) : null}

      <Col xs={12}>
        <FinancialOperationsPanel enabled={canOpenSection} />
      </Col>

      {isCompanyOwner ? (
        <>
          <Col lg={7}>
            <Card className='manage-finance__info-card shadow-sm border-0 h-100'>
              <Card.Body>
                <h4 className='mb-3'>What This Access Covers</h4>
                <ul className='manage-finance__bullet-list'>
                  <li>Selected users can open the finance section in the sidebar.</li>
                  <li>Selected users can create, update, approve, reject, and delete financial operations.</li>
                  <li>Selected users can upload, download, and remove operation files.</li>
                  <li>Only owners can change the company access list itself.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className='manage-finance__info-card shadow-sm border-0 h-100'>
              <Card.Body>
                <h4 className='mb-3'>Section Notes</h4>
                <ul className='manage-finance__bullet-list'>
                  <li>Access is evaluated against the current active company.</li>
                  <li>Company supervisors do not inherit this section automatically.</li>
                  <li>Owners remain visible even when they are not part of the saved list.</li>
                  <li>This page is the right place to grow invoice and finance tools next.</li>
                </ul>
              </Card.Body>

              <Card.Footer className='bg-transparent border-0 pt-0'>
                <Button variant='outline-dark' onClick={handleRefresh}>
                  Refresh Section State
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </>
      ) : null}
    </Row>
  );
}
