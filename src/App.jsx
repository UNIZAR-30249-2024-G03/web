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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

function title(str) {
  return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}

function arrayToString (array){
  return array.map((e,i) => {
    if (i != array.length) return e
    else return e + ","
  })

}

function App() {
  const { toast } = useToast()
  const [persona, setPersona] = useState(undefined)
  const [email, setEmail] = useState("")

  function TabsDemo() {
    const [reservas, setReservas] = useState([])
    const [espacios, setEspacios] = useState([])
    const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([])

    const [LoadingReservas, setLoadingReservas] = useState(false)
    const [LoadingEspacios, setLoadingEspacios] = useState(false)
    
    function MostrarReservas (){
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
    
      const fetchReservas = () => {
        setLoadingReservas(true)
        fetch(serverHost + "/reservas?idUsuario=" + email)
        .then(response => {
          console.log(response)
          if (response.status == 200){
            return response.json()
          }
        }).then(json => {
          console.log(json)
          setReservas(json)
          setLoadingReservas(false)
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
          
            {/* <Input id="nombre" placeholder="Introduzca el nombre"/> */}
            <Button onClick={() =>{
              setReservas([])
              fetchReservas()
            }}>Actualizar</Button>
          
          <Separator className='my-2'/>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activa</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Espacios</TableHead>
              <TableHead>Num personas</TableHead>
              <TableHead>Hora inicio</TableHead>
              <TableHead>Hora final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LoadingReservas && <LoadingRow/>}
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                  <TableCell>
                    <input readOnly type="checkbox" checked={!reserva.anulado} />
                  </TableCell>
                  <TableCell>{new Date(reserva.infoReserva.fechaInicio).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{reserva.infoReserva.descripcion}</TableCell>
                  <TableCell>{arrayToString(reserva.espacios.map(e => e.id))}</TableCell>
                  <TableCell>{reserva.infoReserva.numeroPersonas}</TableCell>
                  <TableCell>{reserva.infoReserva.horaInicio}</TableCell>
                  <TableCell>{reserva.infoReserva.horaFinal}</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        {(reservas.length == 0) && !LoadingReservas && 
          <div className='text-center font-bold py-4'>No hay reservas</div>
        }
        </div>
      )
    }
    
    function BuscarEspacios (){
      const [plantaSeleccionada, setPlantaSeleccionada] = useState(undefined)
      const [categoriaReserva, setCategoriaReserva] = useState(undefined)
      
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
    
      const searchEspacios = (e) => {
        e.preventDefault();
        setEspacios([])
        setLoadingEspacios(true)
        const url = new URL(serverHost + "/espacios?");
        const params = new URLSearchParams();

        const id = e.target.id.value
        if (id) params.set("id", id)

        const numOcupantes = e.target.numOcupantes.value
        if (numOcupantes) params.set("numMaxOcupantes", numOcupantes)

        if (categoriaReserva) params.set("categoriaReserva", categoriaReserva)
          setCategoriaReserva(undefined)

        if (plantaSeleccionada) params.set("planta", plantaSeleccionada)
        setPlantaSeleccionada(undefined)

        const urlConParams = url + params.toString(); 

        console.log(urlConParams)

        fetch(urlConParams)
        .then(response => {
          console.log(response)
          if (response.status == 200){
            return response.json()
          }
        }).then(json => {
          console.log(json)
          setEspacios(json)
          setLoadingEspacios(false)
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
          <span className="text-l leading-7 text-gray-800">Espacios seleccionados</span>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Tamaño (m2)</TableHead>
              <TableHead>Categoria reserva</TableHead>
              <TableHead>Hora apertura</TableHead>
              <TableHead>Hora cierre</TableHead>
              <TableHead>Capacidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {espaciosSeleccionados.map((espacio) => (
              <TableRow key={espacio.id}>
                  <TableCell>{espacio.id}</TableCell>
                  <TableCell>{espacio.tamano}</TableCell>
                  <TableCell>{title(espacio.categoriaReserva.toLowerCase())}</TableCell>
                  <TableCell>{espacio.horario.horaApertura}</TableCell>
                  <TableCell>{espacio.horario.horaCierre}</TableCell>
                  <TableCell>{espacio.capacidadMaxima}</TableCell>
                  <TableCell>
                    <Button onClick={() =>{
                        setEspaciosSeleccionados(espaciosSeleccionados.filter((e) => e.id != espacio.id))
                    }}>Eliminar</Button></TableCell>
              </TableRow>))}
            
          </TableBody>
        </Table>
        {   espaciosSeleccionados.length == 0 && 
              <div className="text-l pt-4 text-center leading-7 text-gray-600">No hay espacios seleccionados</div>}
            {/* <Input id="nombre" placeholder="Introduzca el nombre"/> */}
            <form className='pt-12' onSubmit={searchEspacios}>
              <div className='flex flex-row gap-2'>
            <Select onValueChange={(value) => setPlantaSeleccionada(value)} id="planta">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Planta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            {/* <Input id="planta" placeholder="Introduzca la planta"/> */}
            <Input id="id" placeholder="Id"/>
            <Input type="number" min={0} step={1} id="numOcupantes" placeholder="Número máximo de ocupantes"/>
            {/* <Input id="categoriaReserva" placeholder="Introduzca la categoria de reserva"/> */}
            <Select onValueChange={(value) => setCategoriaReserva(value)} id="categoriaReserva">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria reserva" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AULA">Aula</SelectItem>
                <SelectItem value="SEMINARIO">Seminario</SelectItem>
                <SelectItem value="LABORATORIO">Laboratorio</SelectItem>
                <SelectItem value="DESPACHO">Despacho</SelectItem>
                <SelectItem value="SALA_COMUN">Sala comun</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Buscar</Button>
            </div>
            </form>
          
          <Separator className='my-2'/>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Tamaño (m2)</TableHead>
              <TableHead>Categoria reserva</TableHead>
              <TableHead>Hora apertura</TableHead>
              <TableHead>Hora cierre</TableHead>
              <TableHead>Capacidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LoadingEspacios && <LoadingRow/>}
            {espacios.map((espacio) => (
              <TableRow key={espacio.id}>
                  <TableCell>{espacio.id}</TableCell>
                  <TableCell>{espacio.tamano}</TableCell>
                  <TableCell>{title(espacio.categoriaReserva.toLowerCase())}</TableCell>
                  <TableCell>{espacio.horario.horaApertura}</TableCell>
                  <TableCell>{espacio.horario.horaCierre}</TableCell>
                  <TableCell>{espacio.capacidadMaxima}</TableCell>
                  <TableCell>
                    <Button onClick={() =>{
                      if (espaciosSeleccionados.some((e) => e.id == espacio.id)){
                        setEspaciosSeleccionados(espaciosSeleccionados.filter((e) => e.id != espacio.id))
                      }
                      else {
                        setEspaciosSeleccionados(espaciosSeleccionados.concat(espacio))
                      }
                    }}>{espaciosSeleccionados.some((e) => e.id == espacio.id) ? "Seleccionado" : "Seleccionar" }</Button></TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        {(reservas.length == 0) && !LoadingEspacios && 
          <div className='text-center font-bold py-4'>No hay reservas</div>
        }
        </div>
      )
    }

    return (
      <Tabs defaultValue="nombre" className="flex-col items-center mx-auto gap-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservas">Ver reservas</TabsTrigger>
          <TabsTrigger value="espacio">Buscar espacios</TabsTrigger>
        </TabsList>
        <TabsContent value="reservas">
          <MostrarReservas/>
        </TabsContent>
        <TabsContent value="espacio">
          <BuscarEspacios/>
        </TabsContent>
      </Tabs>
    )
  }

  function Header (){
    return (
      <>
      <div className="bg-white grid gap-y-8 grid-cols-1 pt-24 sm:pt-32 pb-5 sm:pb-8 divide-y">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AdaByron Reservas</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">A traves de esta web puedes gestionar tus reservas de espacios en el edificio Ada Byron de la Escuela de Ingenieria y Arquitectura de la Universidad de Zaragoza
            </p>
            </div>
            <div>
              <div className="flex pt-8 flex-col text-left gap-y-4">
                <dt className="text-xl leading-7 text-gray-600">{(persona !== undefined) ? "Usuario identificado" : "Usuario sin identificar"}</dt>
                {persona && 
                <>
                  <div className='flex flex-row gap-2'>
                    <dt className="text-l leading-7 text-gray-800">Nombre: </dt>
                    <dt className="text-l leading-7 text-gray-600">{persona.nombre}</dt>
                  </div>
                  <div className='flex flex-row gap-2'>
                  <dt className="text-l leading-7 text-gray-800">Departamento: </dt>
                  <dt className="text-l leading-7 text-gray-600">{persona.departamento || "No perteneces a ningún departamento"}</dt>
                  </div>
                  <div className='flex flex-row gap-2'>
                  <dt className="text-l leading-7 text-gray-800">Roles: </dt>
                  <dt className="text-l leading-7 text-gray-600">{arrayToString(persona.roles)}</dt>
                  </div>
                  <Button onClick={() => {
                    setPersona(undefined)
                  }}>
                    Cerrar sesión</Button>
                  </>
                }
              </div>
            </div>
            
          
      </div>
      </>
    )
  }

  function Login (){
    const fetchLogin = (e) =>{
      e.preventDefault()
        const emailValue = e.target.email.value
        setEmail(emailValue)
        fetch(serverHost + "/personas?email=" + emailValue)
        .then(response => {
          console.log(response)
          if (response.status == 200){
            return response.json()
          }
          else {
            toast({
              variant: "destructive",
              title: "¡El usuario no existe!",
              description: "Compruebe que el email es correcto",
            })
          }
        }).then(json => {
          console.log(json)
          setPersona(json)
        }).catch(() => {
          toast({
            variant: "destructive",
            title: "¡Algo ha fallado!",
            description: "Compruebe que el servidor Wrapper esta en ejecución",
          })
        });
    }
    
    if (!persona) return (
    <form onSubmit={fetchLogin}>
            <div className="flex gap-4">
              <Input id="email" placeholder="Introduzca el email"/>
              <Button type="submit">Identificarse</Button>
            </div>
          </form>)
  }
  
  return (
    <div className='flex-col w-3/4 md:w-1/2 items-center mx-auto pb-12'>
      <Header/>
      
      <Login/>
      {persona && 
        <TabsDemo/>
      }
    </div>
  )
}

export default App
