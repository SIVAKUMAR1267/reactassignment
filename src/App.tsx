import { useState,useEffect,useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import axios from 'axios'
import { Paginator } from 'primereact/paginator'   
import type { PaginatorPageChangeEvent } from 'primereact/paginator'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

function App() {
  const [datatable, setDatatable] = useState([])
  const [totalrecord, setTotalRecord] = useState(0)
  const [selectedData, setSelectedData] = useState([])
  const [first, setFirst ] = useState(0)
  const [rows, setRows] = useState(10)
  const [srows, setSrows] = useState('')
  const op = useRef(null)
useEffect(() => {
  const fetchData = async () => {
    try {
      const page = first /rows +1
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`) 
      setDatatable(response.data.data)
      setTotalRecord(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
    fetchData()
 }, [first,rows])
  
  const onPageChange = (event : PaginatorPageChangeEvent) => {
    setFirst(event.first)
    setRows(event.rows)
    
  }
const handlesubmit =async (e) => {
   e.preventDefault()
   const n =parseInt(srows)
   if (isNaN(n) || n <= 0) return
   let selectedRows: any[] = []
   let fetched = 0
   let page = 1
   const pageSize=100
  while (fetched < n){
    try{
      
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${pageSize}`)
      const data = response.data.data
      if (!data.length){
        break
      }
      for (let item of data){
        if (selectedRows.length <n){
          selectedRows.push(item)
        } else{
        break
      }
      }
     
      fetched  = selectedRows.length
      page++
    }
    catch{
      break
    }
  }
  setSelectedData(selectedRows)
  setSrows('')
  op.current?.hide()


}
  
  return (
    <div className="card">
      <DataTable className="p-datatable-striped p-datatable-gridlines p-datatable-sm" value={datatable} selectionMode="multiple" selection={selectedData!}
                        onSelectionChange={(e) => setSelectedData(e.value)} dataKey="id" style={{ minWidth: '60rem', borderRadius: 8, boxShadow: '0 2px 8px #ccc' }}>
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} ></Column>
        <Column header={ <Button type="button" icon="pi pi-angle-down"  onClick={(e) => op.current.toggle(e)} />} ></Column>
        <Column field='title' header='Title'></Column>
        <Column field='place_of_origin' header='Place of Origin'></Column>
        <Column field ='artist_display' header='Artist Display'></Column>
        <Column field='date_start' header='Start Date'></Column>
        <Column field='date_end' header='End Date'></Column>
        
      </DataTable>
      <OverlayPanel ref={op}>
              <form onSubmit={handlesubmit} >
                <div>
                   <InputText type="number" placeholder="Enter number of rows" value={srows} onChange={e => setSrows(e.target.value)} />
                </div>
               <Button type="submit" label="Submit" />
              </form>
      </OverlayPanel>
      <div className="card2">
        <Paginator first={first} rows={rows} totalRecords={totalrecord} onPageChange={onPageChange} style={{
    borderRadius: '16px',
    boxShadow: '0 2px 16px #bdbdbd',
    background: 'var(--surface-card)',
    margin: '0 auto',
    padding: '0.5rem 2rem',
    maxWidth: 500,
    display: 'flex',
    justifyContent: 'center'
  }}/>
      </div>
        </div>
       
  )
}

export default App
