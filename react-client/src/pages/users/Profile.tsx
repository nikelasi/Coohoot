import { Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import Page from "../../features/layout/Page.layout"
import NotImplemented from '../common/NotImplemented'

const Profile: React.FC = () => {

  const { username } = useParams()

  return (
    <Page>
      <Text>{username}'s Profile</Text>
      <NotImplemented />
    </Page>
  )
}

export default Profile