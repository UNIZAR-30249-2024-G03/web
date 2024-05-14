import './App.css'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from '@radix-ui/react-separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { useToast } from "@/components/ui/use-toast"

const serverHost = "http://localhost:4040"


export function TabsDemo() {
  const [registrosCintas, setRegistrosCintas] = useState({})
  const [loadingCintas, setLoadingCintas] = useState(false)
  const [noResultadosCintas, setNoResultadosCintas] = useState(true)
  function BuscarPorCinta (){
    const LoadingRow = ( () =>
      <TableRow key={"loading"}>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
      </TableRow>
      )
  
    const fetchCinta = (e) => {
      e.preventDefault()
      setNoResultadosCintas(false)
      setLoadingCintas(true)
      const cinta = e.target.cinta.value
      console.log(cinta)
      fetch(serverHost + "/cinta/" + cinta)
      .then(response => {
        console.log(response)
        if (response.status == 200){
          return response.json()
        }
      }).then(json => {
        console.log(json)
        if (json.length == 0){
            setNoResultadosCintas(true)
            setLoadingCintas(false)
        }
        else {
          setRegistrosCintas(json)
          setLoadingCintas(false)
        }
      }).catch(() => {
        toast({
          variant: "destructive",
          title: "¡Algo ha fallado!",
          description: "Compruebe que el servidor Wrapper esta en ejecución",
        })
      });
    }
  
    return (
      <div >
        <form onSubmit={fetchCinta}>
          <div className="flex gap-4">
            <Input id="cinta" placeholder="Introduzca la cinta"/>
            <Button type="submit">Buscar</Button>
          </div>
        </form>
        <Separator className='my-2'/>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cinta</TableHead>
            <TableHead className="text-right">Registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCintas && <LoadingRow/>}
          {!loadingCintas && !noResultadosCintas && 
            registrosCintas.map((registro) => (
            <TableRow key={registro.nombre}>
                <TableCell>{registro.nombre}</TableCell>
                <TableCell>{registro.categoria}</TableCell>
                <TableCell>{registro.cintas}</TableCell>
                <TableCell className="text-right">{registro.numRegistro}</TableCell>
            </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {noResultadosCintas && 
        <div className='text-center font-bold py-4'>No hay resultados para esa busqueda</div>
      }
      </div>
    )
  }
  const [registroNombre, setRegistroNombre] = useState({})
  const [loadingNombre, setLoadingNombre] = useState(false)
  const [noResultadosNombre, setNoResultadosNombre] = useState(true)
  function BuscarPorNombre (){
    
    const LoadingRow = ( () =>
      <TableRow key={"loading"}>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
      </TableRow>
      )
  
    const fetchNombre = (e) => {
      e.preventDefault()
      setNoResultadosNombre(false)
      setLoadingNombre(true)
      const nombre = e.target.nombre.value
      console.log(nombre)
      fetch(serverHost + "/registro/" + nombre)
      .then(response => {
        console.log(response)
        if (response.status == 200){
          return response.json()
        }
        if (response.status == 404){
          setNoResultadosNombre(true)
          setLoadingNombre(false)
        }
      }).then(json => {
        console.log(json)
        setRegistroNombre(json)
        setLoadingNombre(false)
      }).catch(() => {
        toast({
          variant: "destructive",
          title: "¡Algo ha fallado!",
          description: "Compruebe que el servidor Wrapper esta en ejecución",
        })
      });
    }
  
    return (
      <div >
        
          <form onSubmit={fetchNombre}>
          <div className="flex gap-4">
          <Input id="nombre" placeholder="Introduzca el nombre"/>
          <Button type="submit">Buscar</Button>
          </div>
          </form>
        
        <Separator className='my-2'/>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cinta</TableHead>
            <TableHead className="text-right">Registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingNombre && <LoadingRow/>}
          {!loadingNombre && !noResultadosNombre && 
            <TableRow key={registroNombre.nombre}>
                <TableCell>{registroNombre.nombre}</TableCell>
                <TableCell>{registroNombre.categoria}</TableCell>
                <TableCell>{registroNombre.cintas}</TableCell>
                <TableCell className="text-right">{registroNombre.numRegistro}</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
      {noResultadosNombre && 
        <div className='text-center font-bold py-4'>No hay resultados para esa busqueda</div>
      }
      </div>
    )
  }
  return (
    <Tabs defaultValue="nombre" className="flex-col items-center mx-auto gap-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nombre">Buscar por nombre</TabsTrigger>
        <TabsTrigger value="cinta">Buscar por cinta</TabsTrigger>
      </TabsList>
      <TabsContent value="nombre">
        <BuscarPorNombre/>
      </TabsContent>
      <TabsContent value="cinta">
        <BuscarPorCinta/>
      </TabsContent>
    </Tabs>
  )
}

export function Header (){
  const { toast } = useToast()
  const [numRegistros, setNumRegistros] = useState("")
  useEffect(() => {
    fetch(serverHost + "/numRegistros")
    .then(response => {
      if (response.status == 200){
        return response.json()
      }
    }).then(json => {
      setNumRegistros(json)
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "¡Algo ha fallado!",
        description: "Compruebe que el servidor Wrapper esta en ejecución",
      })
    });
  },[])
  return (
    <>
    <div className="bg-white grid gap-y-8 lg:gap-0 grid-cols-1 lg:grid-cols-2 pt-24 sm:pt-32 pb-10 sm:pb-14">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Database-MSDOS</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">Wrapper para una aplicación legada que es un programa en BASIC para MS-DOS, desarrollada en un IBM PC a comienzos de la década de 1980, que almacena en fichero la información de distintos programas para el ordenador Sinclair ZX Spectrum (nombre, tipo de juego, y cinta/s donde se encuentra almacenado)
          </p>
          </div>
          <div className='grid items-center'>
            <div className="mx-auto flex max-w-xs flex-col text-center gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Registros en el sistema</dt>
              {(numRegistros == "") 
                ? <Skeleton className="order-first mx-auto h-12 w-[100px]" />
                : <dd className="order-first text-5xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{numRegistros}</dd> }
              
            </div>
          </div>
          
        
    </div>
    </>
  )
}

export function Login (){
  const { toast } = useToast()

  const fetchLogin = (e) =>{
    e.preventDefault()
      //setNoResultadosCintas(false)
      //setLoadingCintas(true)
      const cinta = e.target.cinta.value
      console.log(cinta)
      fetch(serverHost + "/personas?email=" + cinta)
      .then(response => {
        console.log(response)
        if (response.status == 200){
          return response.json()
        }
      }).then(json => {
        console.log(json)
        if (json.length == 0){
            //setNoResultadosCintas(true)
            //setLoadingCintas(false)
        }
        else {
          //setRegistrosCintas(json)
          //setLoadingCintas(false)
        }
      }).catch(() => {
        toast({
          variant: "destructive",
          title: "¡Algo ha fallado!",
          description: "Compruebe que el servidor Wrapper esta en ejecución",
        })
      });
  }

  return (
  <form onSubmit={fetchLogin}>
          <div className="flex gap-4">
            <Input id="cinta" placeholder="Introduzca la cinta"/>
            <Button type="submit">Buscar</Button>
          </div>
        </form>)
}

function App() {
  return (
    <div className='flex-col w-3/4 md:w-1/2 items-center mx-auto pb-12'>
      {/* <Header/>
      <TabsDemo/> */}
      <Login/>
    </div>
  )
}

export default App
