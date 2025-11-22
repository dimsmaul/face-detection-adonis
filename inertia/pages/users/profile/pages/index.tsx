import User from '#models/user'
import dayjs from 'dayjs'
import React from 'react'
import Preview from '~/components/preview'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export interface ProfileProps {
  user: User
}

const Profile: React.FC<ProfileProps> = (props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-10">
        <Avatar className="w-52 h-52">
          <AvatarImage src={props.user.profile || ''} className="object-cover" />
          <AvatarFallback>
            {props.user.name ? props.user.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-lg">Personal Data</h1>
      </div>
      <div className="grid grid-cols-2 gap-5  w-5xl mt-10">
        <Preview label={'Name'} children={props.user.name} />
        <Preview label={'NIM'} children={props.user.nim} />
        <Preview
          label={'Date of Birth'}
          children={
            props.user.userData.dob ? dayjs(props.user.userData.dob).format('DD MMM YYYY') : ''
          }
        />
        <Preview label={'Email'} children={props.user.email} />
        <Preview label={'Major'} children={props.user.major} />
        <Preview
          label={'Date Of Acceptance'}
          children={
            props.user.dateOfAcceptance
              ? dayjs(props.user.dateOfAcceptance).format('DD MMM YYYY')
              : ''
          }
        />
        <Preview label={'Address'} children={props.user.userData.address} />
        <Preview label={'Sub District'} children={props.user.userData.subDistrict} />
        <Preview label={'City'} children={props.user.userData.city} />
        <Preview label={'Profince'} children={props.user.userData.province} />
        <Preview label={'Postal Code'} children={props.user.userData.postalCode} />
      </div>
    </div>
  )
}

export default Profile
