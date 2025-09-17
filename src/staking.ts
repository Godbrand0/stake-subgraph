import { BigInt,Bytes } from "@graphprotocol/graph-ts"
import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  
  RewardRateUpdated as RewardRateUpdatedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,

  TokenRecovered as TokenRecoveredEvent,
 
  Withdrawn as WithdrawnEvent
} from "../generated/Staking/Staking"
import {
  EmergencyWithdrawn,
 
  RewardRateUpdated,
  RewardsClaimed,
  Staked,
  TotalEmergencyWithdrawn,
  TotalUsers,
  Totalstaked,
  TotalRewardClaimed,
  Withdrawn,
 UserCreated,
 TotalWithdrawn
} from "../generated/schema"

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  let entity = new EmergencyWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.penalty = event.params.penalty
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
  handleTotalEmergencyWithdrawn(event.params.amount)
}
export function handleTotalEmergencyWithdrawn(amount: BigInt): void {
  let stats = TotalEmergencyWithdrawn.load("1")
  if (stats == null) {
    stats = new TotalEmergencyWithdrawn("1")
    stats.totalWithdrawn=BigInt.fromI32(0)
  }
  stats.totalWithdrawn=stats.totalWithdrawn.plus(amount)
  stats.save()
}



export function handleRewardRateUpdated(event: RewardRateUpdatedEvent): void {
  let entity = new RewardRateUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldRate = event.params.oldRate
  entity.newRate = event.params.newRate
  entity.timestamp = event.params.timestamp
  entity.totalStaked = event.params.totalStaked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let entity = new RewardsClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newPendingRewards = event.params.newPendingRewards
  entity.totalStaked = event.params.totalStaked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  handleTotalRewardsClaimed(event.params.amount)
}

export function handleTotalRewardsClaimed(amount: BigInt): void {
  let stats = TotalRewardClaimed.load("1")
  if (stats == null) {
    stats = new TotalRewardClaimed("1")
    stats.totalClaimed=BigInt.fromI32(0)
  }
  stats.totalClaimed=stats.totalClaimed.plus(amount)
  stats.save()
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked
  entity.currentRewardRate = event.params.currentRewardRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  

  entity.save()

  handleUserCreated(event.params.user, event.params.timestamp)

  handleTotalStaked(event.params.amount)
}

export function handleUserCreated (userAddress: Bytes, timestamp: BigInt): void {
  
  let userID = userAddress.toHexString()
  let user = UserCreated.load(userID)
  if (user == null) {
    user = new UserCreated(userID)
    user.createdTimestamp = timestamp
    user.save()
    handleTotalUsers()
  }
  
  
}

export function handleTotalUsers (): void {
  
  let stats = TotalUsers.load("1")
  if (stats == null) {
    stats = new TotalUsers("1")
    stats.totalUsers=BigInt.fromI32(0)
  }
  stats.totalUsers=stats.totalUsers.plus(BigInt.fromI32(1))
  stats.save()
}

export function handleTotalStaked(amount: BigInt): void {
let stats = Totalstaked.load("1")
if (stats == null) {
  stats = new Totalstaked("1")
  stats.totalStaked=BigInt.fromI32(0)
} 
stats.totalStaked=stats.totalStaked.plus(amount)
stats.save()
}







export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newTotalStaked = event.params.newTotalStaked
  entity.currentRewardRate = event.params.currentRewardRate
  entity.rewardsAccrued = event.params.rewardsAccrued

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  handleTotalWithdrawn(event.params.amount)
}

export function handleTotalWithdrawn(amount: BigInt): void {
  let stats = TotalWithdrawn.load("1")
  if (stats == null) {
    stats = new TotalWithdrawn("1")
    stats.totalWithdrawn=BigInt.fromI32(0)
  }
  stats.totalWithdrawn=stats.totalWithdrawn.plus(amount)
  stats.save()
}





// whats working
// rewardsclaimeds
// userCreateds
// totalStakeds
// totalRewardClaimed
// stakeds