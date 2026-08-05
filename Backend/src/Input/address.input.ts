import { Field, Float, ID, InputType } from "type-graphql";

@InputType()
export class AddAddressInput {
  @Field(() => ID, { nullable: true })
  label?: string;

  @Field(() => String)
  addressLine1!: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  state!: string;

  @Field(() => String)
  pincode!: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;

  @Field(() => Boolean, { nullable: true })
  isDefault?: boolean;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => ID)
  addressId!: string;

  @Field(() => ID, { nullable: true })
  label?: string;

  @Field(() => String, { nullable: true })
  addressLine1?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  pincode?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;

  @Field(() => Boolean, { nullable: true })
  isDefault?: boolean;
}
