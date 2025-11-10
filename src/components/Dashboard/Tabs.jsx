import { useId, useState } from 'react'
import '../../styles/Tabs.css'

export function Tabs ({ tabs, children, groupName = 'tabs-group' }) {
  const [activeTab, setActiveTab] = useState(0)
  const id = useId()

  return (
    <div className='tabs-container'>
      <div className='tabs-header'>
        {tabs.map((tab, idx) => (
          <label key={tab} className={`tab-radio ${activeTab === idx ? 'active' : ''}`}>
            <input
              type='radio'
              name={`${groupName}-${id}`}
              value={idx}
              checked={activeTab === idx}
              onChange={() => setActiveTab(idx)}
            />
            <span className='tab-label'>{tab}</span>
          </label>
        ))}
      </div>
      <div className='tabs-content'>
        {Array.isArray(children) ? children[activeTab] : children}
      </div>
    </div>
  )
}
