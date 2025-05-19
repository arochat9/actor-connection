import type { linkActors } from "@service-user-for-actor-apps/sdk"
import ConnectionCard from "./connection-card"
import { useRef, Fragment } from "react"

interface ConnectionResultsProps {
  connections: linkActors.ReturnType
  isLoading: boolean
  error: string | null
}

export default function ConnectionResults({ connections, isLoading, error }: ConnectionResultsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
      </div>
    )
  }

  if (error) {
    return <div className="noResults">{error}</div>
  }

  if (!connections || connections.length === 0) {
    return null
  }

  // Determine if we have a small number of connections
  const hasFewConnections = connections.length <= 3;
  
  // Calculate the total width for centering
  // Each actor is ~170px, each movie is ~170px, each arrow is ~12px
  const totalItems = connections.length;
  const totalArrows = totalItems - 1;
  const totalWidth = totalItems * 170 + totalArrows * 12;

  return (
    <div className="resultsContainer w-full">
      <div className="px-4 sm:px-6">
        <div className="connectionSummary">Found connection in {(connections.length - 1) / 2} degrees of separation</div>
      </div>
      
      <div className="carouselContainer">
        <div 
          className="carouselContentWrapper" 
          ref={wrapperRef}
          style={hasFewConnections ? { justifyContent: 'center' } : {}}
        >
          <div 
            className="carouselTrack" 
            style={hasFewConnections ? { 
              margin: '0 auto',
              width: 'fit-content',
              display: 'flex' 
            } : {}}
          >
            {connections.map((connection, index) => {
              const isActorNode = index % 2 === 0
              
              return (
                <Fragment key={index}>
                  <ConnectionCard 
                    connection={connection}
                    isActorNode={isActorNode}
                  />
                  
                  {index < connections.length - 1 && (
                    <div className="connectionArrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
