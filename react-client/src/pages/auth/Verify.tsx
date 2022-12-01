import { useParams } from 'react-router-dom'

const Verify: React.FC = () => {

  const { token } = useParams()

  return (
    <div>
      <h1>Verify</h1>
      <p>Token: {token}</p>
    </div>
  )
}

export default Verify