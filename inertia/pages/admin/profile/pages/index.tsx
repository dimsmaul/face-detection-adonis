import Admin from '#models/admin'
import dayjs from 'dayjs'
import React from 'react'
import Preview from '~/components/preview'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export interface ProfileProps {
  data: Admin
}

const Profile: React.FC<ProfileProps> = (props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-10">
        <Avatar className="w-52 h-52">
          <AvatarImage src={props.data.profile || ''} className="object-cover" />
          <AvatarFallback>
            {props.data.name ? props.data.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-lg">Personal Data</h1>
      </div>
      <div className="grid grid-cols-2 gap-5  w-5xl mt-10">
        <Preview label={'Name'} children={props.data.name ?? '-'} />
        <Preview label={'NIP'} children={props.data.nip ?? '-'} />
        <Preview
          label={'Date of Birth'}
          children={
            props.data.userData?.dob
              ? dayjs(props.data.userData?.dob?.toJSDate()).format('DD MMM YYYY')
              : '-'
          }
        />
        <Preview label={'Email'} children={props.data?.email ?? '-'} />
        <Preview label={'Major'} children={props.data?.subject ?? '-'} />
        {/* <Preview
          label={'Date Of Acceptance'}
          children={
            props.data.dateOfAcceptance
              ? dayjs(props.data.dateOfAcceptance.toJSDate()).format('DD MMM YYYY')
              : ''
          }
        /> */}
        <Preview label={'Address'} children={props.data.userData?.address ?? '-'} />
        <Preview label={'Sub District'} children={props.data.userData?.subDistrict ?? '-'} />
        <Preview label={'City'} children={props.data.userData?.city ?? '-'} />
        <Preview label={'Profince'} children={props.data.userData?.province ?? '-'} />
        <Preview label={'Postal Code'} children={props.data.userData?.postalCode ?? '-'} />
      </div>
    </div>
  )
}

export default Profile
