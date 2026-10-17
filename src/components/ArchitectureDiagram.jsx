import { Fragment, useId, useState } from 'react'
import './ArchitectureDiagram.css'

export default function ArchitectureDiagram({ architecture, lang = 'en' }) {
  const headingId = useId()
  const helperId = useId()
  const detailId = useId()
  const [selectedId, setSelectedId] = useState(architecture?.nodes?.[0]?.id)
  const nodes = architecture?.nodes ?? []
  if (!nodes.length) return null

  const activeNode = nodes.find(node => node.id === selectedId) ?? nodes[0]
  const labels = lang === 'th' ? {
    heading: 'ระบบทำงานอย่างไร',
    helper: 'เลือกแต่ละส่วนเพื่อดูหน้าที่และการทำงาน',
    group: 'ส่วนประกอบและการรับส่งข้อมูลในระบบ',
    branches: 'การเชื่อมต่อเพิ่มเติม',
    from: 'เชื่อมต่อจาก',
    evidence: 'ดูการทำงานจากโค้ด',
  } : {
    heading: 'How the system works',
    helper: 'Select a component to explore its role.',
    group: 'System components and data flow',
    branches: 'Additional system connections',
    from: 'Connected from',
    evidence: 'Explore the implementation',
  }
  const primaryNodes = nodes.slice(0, 3)
  const connections = architecture.connections ?? []
  const primaryConnections = primaryNodes.flatMap((node, index) => connections.filter(item => item.from === node.id && item.to === primaryNodes[index + 1]?.id))
  const branchConnections = connections.filter(connection => !primaryConnections.includes(connection))
  const unlinkedNodes = nodes.slice(3).filter(node => !branchConnections.some(connection => connection.to === node.id))
  const columns = primaryNodes.map((_, index) => `${index ? 'minmax(28px, .38fr) ' : ''}minmax(0, 1fr)`).join(' ')
  const renderNode = node => <button
    type="button"
    className="architecture-node"
    aria-pressed={activeNode.id === node.id}
    aria-controls={detailId}
    onClick={() => setSelectedId(node.id)}
  >
    <span className="architecture-step" aria-hidden="true">{String(nodes.indexOf(node) + 1).padStart(2, '0')}</span>
    <span className="architecture-node-label">{node.label}</span>
    <span className="architecture-node-technology">{node.technology}</span>
  </button>
  const renderConnection = connection => <div className="architecture-connection">
    {connection && <>
      <span className="architecture-connection-label">{connection.label}</span>
      <span className="architecture-connection-arrow" aria-hidden="true" />
    </>}
  </div>

  return <section className="architecture" aria-labelledby={headingId}>
    <h3 id={headingId}>{labels.heading}</h3>
    {architecture.intro && <p className="architecture-intro">{architecture.intro}</p>}
    <p id={helperId} className="architecture-helper">{labels.helper}</p>
    <div className="architecture-flow" role="group" aria-label={labels.group} aria-describedby={helperId} style={{ '--architecture-columns': columns }}>
      {primaryNodes.map((node, index) => {
        const nextNode = primaryNodes[index + 1]
        const connection = nextNode && connections.find(item => item.from === node.id && item.to === nextNode.id)
        return <Fragment key={node.id}>
          {renderNode(node)}
          {nextNode && renderConnection(connection)}
        </Fragment>
      })}
    </div>
    {branchConnections.length > 0 && <div className="architecture-branches" role="group" aria-label={labels.branches}>
      {branchConnections.map(connection => {
        const source = nodes.find(node => node.id === connection.from)
        const destination = nodes.find(node => node.id === connection.to)
        if (!source || !destination) return null
        return <div className="architecture-branch" key={`${connection.from}-${connection.to}`}>
          <div className="architecture-branch-source"><span>{labels.from}</span><strong>{source.label}</strong></div>
          {renderConnection(connection)}
          {renderNode(destination)}
        </div>
      })}
    </div>}
    {unlinkedNodes.length > 0 && <div className="architecture-unlinked">{unlinkedNodes.map(node => <Fragment key={node.id}>{renderNode(node)}</Fragment>)}</div>}
    <div id={detailId} className="architecture-detail" aria-live="polite" aria-atomic="true">
      <h4>{activeNode.label}</h4>
      <p className="architecture-detail-technology">{activeNode.technology}</p>
      <p className="architecture-detail-description">{activeNode.description}</p>
    </div>
    {architecture.note && <p className="architecture-note">{architecture.note}</p>}
    {architecture.evidence?.length > 0 && <div className="architecture-evidence">
      <h4>{labels.evidence}</h4>
      <ul>{architecture.evidence.map(source => <li key={source.href}>
        <a href={source.href} target="_blank" rel="noreferrer">
          <span>{source.label}</span>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 18 18 6M6 6h12v12" /></svg>
        </a>
      </li>)}</ul>
    </div>}
  </section>
}
