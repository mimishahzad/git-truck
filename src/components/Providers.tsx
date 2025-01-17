import { useEffect, useMemo, useState } from "react"
import type { HydratedGitBlobObject, HydratedGitObject } from "~/analyzer/model"
import { ClickedObjectContext } from "~/contexts/ClickedContext"
import type { RepoData } from "~/routes/$repo.$"
import { DataContext } from "../contexts/DataContext"
import { MetricsContext } from "../contexts/MetricContext"
import type { ChartType, HierarchyType, OptionsContextType } from "../contexts/OptionsContext"
import { getDefaultOptionsContextValue, OptionsContext } from "../contexts/OptionsContext"
import { PathContext } from "../contexts/PathContext"
import { SearchContext } from "../contexts/SearchContext"
import type { AuthorshipType, MetricsData, MetricType } from "../metrics/metrics"
import { createMetricData as createMetricsData } from "../metrics/metrics"
import { OPTIONS_LOCAL_STORAGE_KEY } from "~/analyzer/constants"
import type { SizeMetricType } from "~/metrics/sizeMetric"
import type { DepthType } from "~/metrics/chartDepth"
import type { CommitTab } from "~/contexts/CommitTabContext"
import { CommitTabContext, getDefaultCommitTab } from "~/contexts/CommitTabContext"

interface ProvidersProps {
  children: React.ReactNode
  data: RepoData
}

export function Providers({ children, data }: ProvidersProps) {
  const [options, setOptions] = useState<OptionsContextType | null>(null)
  const [commitTab, setCommitTab] = useState<CommitTab | null>(null)
  const [searchResults, setSearchResults] = useState<Record<string, HydratedGitObject>>({})
  const [path, setPath] = useState(data.repo.name)
  const [clickedObject, setClickedObject] = useState<HydratedGitObject | null>(null)

  const metricsData: MetricsData = useMemo(
    () => createMetricsData(data.analyzerData, data.truckConfig.colorSeed),
    [data]
  )

  const commitTabValue = useMemo(
    () => ({
      ...getDefaultCommitTab(),
      ...commitTab,
      setStartDate: (newDate: number | null) => {
        setCommitTab((prevValue) => ({
          ...(prevValue ?? getDefaultCommitTab()),
          startDate: newDate
        }))
      },
      setEndDate: (newDate: number | null) => {
        setCommitTab((prevValue) => ({
          ...(prevValue ?? getDefaultCommitTab()),
          endDate: newDate
        }))
      }
    }),
    [commitTab]
  )

  const optionsValue = useMemo<OptionsContextType>(
    () => ({
      ...getDefaultOptionsContextValue(),
      ...options,
      setMetricType: (metricType: MetricType) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          metricType
        })),
      setChartType: (chartType: ChartType) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          chartType
        })),
      setDepthType: (depthType: DepthType) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          depthType
        })),
      setHierarchyType: (hierarchyType: HierarchyType) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          hierarchyType
        })),
      setAuthorshipType: (authorshipType: AuthorshipType) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          authorshipType
        })),
      setSizeMetricType: (sizeMetric: SizeMetricType) =>
        setOptions((prevOptions) => ({ ...(prevOptions ?? getDefaultOptionsContextValue()), sizeMetric })),
      setHoveredBlob: (blob: HydratedGitBlobObject | null) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          hoveredBlob: blob
        })),
      setClickedObject: (object: HydratedGitObject | null) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          clickedObject: object
        })),
      setTransitionsEnabled: (enabled: boolean) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          transitionsEnabled: enabled
        })),
      setLabelsVisible: (visible: boolean) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          labelsVisible: visible
        })),
      setRenderCutoff: (renderCutoff: number) =>
        setOptions((prevOptions) => ({
          ...(prevOptions ?? getDefaultOptionsContextValue()),
          renderCutoff: renderCutoff
        })),
    }),
    [options]
  )

  useEffect(() => {
    let canceled = false
    // Persist options to local storage
    if (options) {
      requestAnimationFrame(() => {
        if (canceled) return
        localStorage.setItem(OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(options))
      })
    }
    return () => {
      canceled = true
    }
  }, [options])

  useEffect(() => {
    const savedOptions = localStorage.getItem(OPTIONS_LOCAL_STORAGE_KEY)
    if (savedOptions) {
      setOptions({
        ...getDefaultOptionsContextValue(JSON.parse(savedOptions)),
        hasLoadedSavedOptions: true
      })
    }
  }, [])

  return (
    <DataContext.Provider value={data}>
      <MetricsContext.Provider value={metricsData}>
        <OptionsContext.Provider value={optionsValue}>
          <SearchContext.Provider
            value={{
              searchResults,
              setSearchResults
            }}
          >
            <PathContext.Provider value={{ path, setPath }}>
              <ClickedObjectContext.Provider value={{ clickedObject, setClickedObject }}>
                <CommitTabContext.Provider value={commitTabValue}>{children}</CommitTabContext.Provider>
              </ClickedObjectContext.Provider>
            </PathContext.Provider>
          </SearchContext.Provider>
        </OptionsContext.Provider>
      </MetricsContext.Provider>
    </DataContext.Provider>
  )
}
