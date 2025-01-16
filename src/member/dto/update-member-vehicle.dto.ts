import { PartialType } from "@nestjs/swagger";
import { CreateMemberVehicleDto } from "./create-member-vehicle.dto";

export class UpdateMemberVehicleDto extends PartialType(CreateMemberVehicleDto) {}