import {useEffect,useState} from 'react'

export default function BookInfo({a}) {

const [book,setbook] = useState('')

  useEffect(() => {
    if(a){
      setbook(a)
    }
  },[a])

    const x = book.info?.map((item) => {
      const number = item.match(/^(\d{2})(.*)$/)[1]
      const word = item.replace(number,'')
      return {word}
  }) ?? [];

  const sortOrigin = x.map(item => item.word).filter(item => item.toLowerCase().includes('north america') || item.toLowerCase().includes('asia') || item.toLowerCase().includes('africa') || item.toLowerCase().includes('cosmopolitan')).toString()
  
  const sortType = x.map(item => item.word).filter(item => item.toLowerCase().includes('stem') || item.toLowerCase().includes('rosulate') || item.toLowerCase().includes('rhizomatous') || item.toLowerCase().includes('carpeting') || item.toLowerCase().includes('bulb/onion')).toString()
  
  const sortGrowth = x.map(item => item.word).filter(item => item.toLowerCase().includes('slow') || item.toLowerCase().includes('moderate') || item.toLowerCase().includes('fast')).toString()
  
  const sortLighting = x.map(item => item.word)
  .filter(item => {
    const lowerCaseItem = item.toLowerCase()
    return lowerCaseItem === 'low' || lowerCaseItem === 'medium' || lowerCaseItem === 'high'
  }).toString()

  const sortHeight = x.map(item => item.word).filter(item => item.toLowerCase().includes('3-10+') || item.toLowerCase().includes('10-15+') || item.toLowerCase().includes('15-30+')).toString()

  const sortCO2 = x.map(item=> item.word).filter(item => item.toLowerCase().includes('low-level') || item.toLowerCase().includes('medium-level') || item.toLowerCase().includes('high-level')).toString()

  return (
    <>
    <table className="mx-auto">
      <tbody>
     <tr>
      <td>Type:</td>
      <td>{sortType}</td>
     </tr>
     <tr>
      <td>Origin:</td>
      <td>{sortOrigin}</td>
     </tr>
     <tr>
      <td>Growth Rate:</td>
      <td>{sortGrowth}</td>
     </tr>
     <tr>
      <td>Height:</td>
      <td>{sortHeight}</td>
     </tr>
     <tr>

      <td>Lighting:</td>
     
      <td>{sortLighting}</td>
      
     </tr>

     <tr>
      <td>CO2:</td>
      <td>{sortCO2.split('-level')}</td>
     </tr>
    
      </tbody>
      </table>
    </>
  )
}
