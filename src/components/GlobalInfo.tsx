import { useData } from "../contexts/DataContext"
import { usePath } from "../contexts/PathContext"
import { Spacer } from "./Spacer"
import { Box, BoxTitle, ClickableText, NonClickableText } from "./util"

export function GlobalInfo() {
  const data = useData()
  const {path, setPath} = usePath()

  let temppath = path
  let paths : [string, string][] = []

  for(let i = 0; i < 3; i++) {
    if (temppath === "") { break; }
    const idx = temppath.lastIndexOf("/")
    paths.push([temppath.substring(idx+1), temppath])
    temppath = temppath.substring(0,idx)
  }
  if (temppath !== "") {
    paths = paths.slice(0,paths.length-1); 
    paths.push(["...",""]); 
    paths.push([data.repo,data.repo])
  }

  return (
    <Box>
      <BoxTitle>{data.repo}</BoxTitle>
      <Spacer />
      <div>
        <strong>Branch: </strong>
        {data.branch}
      </div>
      <div>
        <strong>Path: </strong>
        {paths.reverse().map(([name, p],i) => {
          if (p === "" || i === paths.length-1) return <NonClickableText key={p}>/{name}</NonClickableText>
          else return <ClickableText key={p} onClick={() => setPath(p)}>/{name}</ClickableText>
        })}
      </div>
    </Box>
  )
}