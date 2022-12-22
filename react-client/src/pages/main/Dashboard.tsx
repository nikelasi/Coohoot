import { Text } from '@chakra-ui/react'
import useAuthWall from '../../features/auth/useAuthWall'
import Page from "../../features/layout/Page.layout"
import NotImplemented from '../common/NotImplemented'

const Dashboard: React.FC = () => {

  useAuthWall()

  return (
    <Page>
      <Text>Dashboard</Text>
      <NotImplemented />
    </Page>
  )
}

export default Dashboard