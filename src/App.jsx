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
import { Label } from "@/components/ui/label"
import { Separator } from '@radix-ui/react-separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import es from 'date-fns/locale/es';
import 'leaflet/dist/leaflet.css';
import { GeoJSON, MapContainer, TileLayer, FeatureGroup, Rectangle, useMap, LayerGroup, Circle, LayersControl, Marker, Popup, WMSTileLayer } from 'react-leaflet'
import { useMapEvents } from 'react-leaflet/hooks'

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
  const [persona, setPersona] = useState(undefined)
  const [email, setEmail] = useState("")
  const [planta0GeoJson, setplanta0GeoJson] = useState()
  const [geoJsonFiltrado, setGeoJsonFiltrado] = useState()

  function TabsDemo() {
    const [reservas, setReservas] = useState([])
    const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([])
    const [espacios, setEspacios] = useState([])
    const [espaciosMostrarGeoJSON, setEspaciosMostrarGeoJSON] = useState([])

    useEffect(() =>{
      console.log(planta0GeoJson)
      const pruebaFiltrado = ({
        ...planta0GeoJson,
        features : planta0GeoJson.features.filter((f) => espacios.some((e) => e.id == f.id.replace("espacio.", "")))
        }
      )
      console.log(pruebaFiltrado)
      setEspaciosMostrarGeoJSON(pruebaFiltrado)
      console.log("espacios modificado")
    }
    , [espacios])

    const [LoadingReservas, setLoadingReservas] = useState(false)
    const [LoadingEspacios, setLoadingEspacios] = useState(false)
    
    function MostrarReservas (){
      const { toast } = useToast()
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
      const { toast } = useToast()
      const [plantaSeleccionada, setPlantaSeleccionada] = useState(undefined)
      const [categoriaReserva, setCategoriaReserva] = useState(undefined)
      const [tipoUsoReserva, setTipoUsoReserva] = useState(undefined)
      const [dateReserva, setDateReserva] = useState(new Date())

      const TablaEspacios = () => {
        console.log(espacios)
        return (
          <>
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
                    <Button
                      className={espaciosSeleccionados.some((e) => e.id == espacio.id) && "bg-red-500 hover:bg-red-600"}
                      disabled={!espacio.reservable}
                     onClick={() =>{
                      if (espaciosSeleccionados.some((e) => e.id == espacio.id)){
                        setEspaciosSeleccionados(espaciosSeleccionados.filter((e) => e.id != espacio.id))
                      }
                      else {
                        setEspaciosSeleccionados(espaciosSeleccionados.concat(espacio))
                      }
                    }}>{espaciosSeleccionados.some((e) => e.id == espacio.id) ? "Cancelar" : "Seleccionar" }</Button></TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        <div>
          {(espacios.length == 0) && !LoadingEspacios && 
          <div className='text-center font-bold py-4'>No hay espacios con esas caracteristicas</div>}
        </div>
        </>
        )
      }
      
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

      const reservarEspacios = (e) => {
        e.preventDefault();
        const fechaInicio = new Date(dateReserva);
        fechaInicio.setHours(e.target.horaInicio.value, 0, 0)
        const fechaFinal = new Date(dateReserva);
        fechaFinal.setHours(e.target.horaFinal.value, 0, 0)
        const body = {
          idUsuario: email,
          idsEspacios: espaciosSeleccionados.map((e) => e.id),
          tipoUsoReserva: tipoUsoReserva,
          numMaxOcupantes: parseInt(e.target.numOcupantes.value),
          fechaInicio: fechaInicio.toISOString(),
          fechaFinal: fechaFinal.toISOString(),
          descripcion: e.target.descripcion.value,
        }
        console.log(body)
        const params = new URLSearchParams();
        params.set("idUsuario", email)
        params.set("idsEspacios", arrayToString(espaciosSeleccionados.map((e) => e.id)))
        params.set("tipoUsoReserva", tipoUsoReserva)
        params.set("numMaxOcupantes", e.target.numOcupantes.value)
        params.set("fechaInicio", fechaInicio.toISOString())
        params.set("fechaFinal", fechaFinal.toISOString())
        params.set("descripcion", e.target.descripcion.value)

        fetch(serverHost + "/reservas?" + params.toString() ,{
          method: "POST",
        })
        .then(async response => {
          console.log(response)
          if (response.status == 200){
            return response.json()
          }
          else {
            const motivo = await response.text()
            toast({
              variant: "destructive",
              title: "¡No se ha podido reservar!",
              description: motivo,
            })
            console.log(motivo)
          }
        }).then(json => {
          if (json){
            setEspaciosSeleccionados([])
            toast({
              title: "¡Reserva completada!",
            })
          }
          console.log(json)
        }).catch(() => {
          toast({
            variant: "destructive",
            title: "¡Algo ha fallado!",
            description: "Compruebe que el servidor Wrapper esta en ejecución",
          })
        });
        // setEspacios([])
        // setLoadingEspacios(true)
        // const url = new URL(serverHost + "/espacios?");
        // const params = new URLSearchParams();

        // const id = e.target.id.value
        // if (id) params.set("id", id)

        // const numOcupantes = e.target.numOcupantes.value
        // if (numOcupantes) params.set("numMaxOcupantes", numOcupantes)

        // if (categoriaReserva) params.set("categoriaReserva", categoriaReserva)
        //   setCategoriaReserva(undefined)

        // if (plantaSeleccionada) params.set("planta", plantaSeleccionada)
        // setPlantaSeleccionada(undefined)

        // const urlConParams = url + params.toString(); 

        // console.log(urlConParams)

        // fetch(urlConParams)
        // .then(response => {
        //   console.log(response)
        //   if (response.status == 200){
        //     return response.json()
        //   }
        // }).then(json => {
        //   console.log(json)
        //   setEspacios(json)
        //   setLoadingEspacios(false)
        // }).catch(() => {
        //   toast({
        //     variant: "destructive",
        //     title: "¡Algo ha fallado!",
        //     description: "Compruebe que el servidor Wrapper esta en ejecución",
        //   })
        // });
      }
    
      return (
        <div >
          <span className="text-l leading-7 text-gray-800">Espacios seleccionados</span>
          <Dialog>
          <DialogTrigger asChild>
          <Button className="w-full" disabled={espaciosSeleccionados.length <= 0}>Reservar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Completar reserva</DialogTitle>
              <DialogDescription>
              <form className='pt-4' onSubmit={reservarEspacios}>
                  <div className='flex flex-col gap-2'>
                {/* <Input id="planta" placeholder="Introduzca la planta"/> */}
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="numOcupantes">Numero de ocupantes esperado</Label>
                  <Input className="w-full" type="number" min={0} step={1} id="numOcupantes" placeholder="Número ocupantes esperado"/>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="fecha">Fecha reserva</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateReserva && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateReserva ? format(dateReserva, "PPP", {locale: es}) : <span>Seleccione un dia</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateReserva}
                        onSelect={setDateReserva}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="horaInicio">Hora comienzo reserva</Label>
                  <Input className="w-full" type="number" min={0} max={23} step={1} id="horaInicio" placeholder="Hora comienzo"/>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="horaFinal">Hora final reserva</Label>
                  <Input className="w-full" type="number" min={0} max={23} step={1} id="horaFinal" placeholder="Hora final"/>
                </div>
                {/* <Input id="categoriaReserva" placeholder="Introduzca la categoria de reserva"/> */}
                <div className="grid w-full gap-1.5">
                <Label htmlFor="tipoUsoReserva">Tipo uso reserva</Label>
                <Select className="w-full" required onValueChange={(value) => setTipoUsoReserva(value)} id="tipoUsoReserva">
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo uso reserva" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Docencia">Docencia</SelectItem>
                    <SelectItem value="Investigacio">Investigación</SelectItem>
                    <SelectItem value="Gestion">Gestión</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea id="descripcion" placeholder="Descripcion"/>
                </div>
                <Button type="submit">Reservar</Button>
                </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
          {/*  */}
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
                    <Button
                    className="bg-red-500 hover:bg-red-600"
                     onClick={() =>{
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
                <SelectItem value="0">0</SelectItem>
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
          <Tabs defaultValue="tabla" className="flex-col items-center mx-auto gap-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tabla">Ver tabla</TabsTrigger>
            <TabsTrigger value="mapa">Ver mapa</TabsTrigger>
          </TabsList>
          <TabsContent value="tabla">
          <TablaEspacios/>
          </TabsContent>
          <TabsContent value="mapa">
            <div className='h-screen'>
          <div className='w-full h-2/3'>
          {planta0GeoJson && <Mapa geoJson={espaciosMostrarGeoJSON}/>}
          </div>
        </div>
          </TabsContent>
        </Tabs>
        
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

  const Mapa = (geoJSON) => {
    console.log(geoJSON.geoJson)
    const center = [41.683728, -0.888642]
    const rectangle = [
      [51.49, -0.08],
      [51.5, -0.06],
    ]
    const [plantaSeleccionada, setPlantaSeleccionada] = useState(0)
    
    return (
          <MapContainer className='map' center={center} zoom={20} maxZoom={21} scrollWheelZoom={true}>
          <TileLayer
            zIndex={0}
            maxZoom={21}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON key={JSON.stringify(geoJSON?.geoJson.features)} data={geoJSON.geoJson} style={{color: "purple"}}></GeoJSON>
        </MapContainer>
    
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
    const { toast } = useToast()
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

  useEffect(
    () => {
      fetch("http://localhost:8080/geoserver/proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto%3Aespacio&outputFormat=application%2Fjson")
      .then((e) => e.json())
      .then((json) => { 
        console.log(json)
        // setplanta0GeoJson(json)
        const planta0 = (
          {
            ...json,
            features : json.features.filter((f) => f.properties.planta == 0)
          }
        )
        setplanta0GeoJson(planta0)
      }) 
    }
    , [])
  
  return (
    <>
    <div className='flex-col w-3/4 md:w-1/2 items-center mx-auto pb-12'>
      <Header/>
      
      <Login/>
      {persona && 
        <TabsDemo/>
      
      }
      
    </div>

    </>
  )
}

export default App
