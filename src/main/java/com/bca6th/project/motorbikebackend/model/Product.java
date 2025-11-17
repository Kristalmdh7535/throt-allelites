package com.bca6th.project.motorbikebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(nullable = false, length = 100)
    private String type; // Naked, Cruiser, Sport, etc.

    @Column(name = "dimension_mm_l_w_h",nullable = false, length = 50)
    //These dimensions describe the physical size of the bike.
    // Width represents the distance across the widest part of the bike,
    // length is the distance from front to back,
    // and height is the vertical measurement from the ground to the highest point of the bike.
    private String dimensionMmLWH; // length*width*height

    @Column(name = "engine_capacity_cc", nullable = false)
    private Integer engineCapacityCc;

    @Column(name = "engine_type", nullable = false, length = 50)
    private String engineType; // air-cooled, liquid-cooled, FI

    @Column(name = "max_power", nullable = false, length = 30)
    private String maxPower;  // hp/Ps

    @Column(name = "max_torque", nullable = false, length = 30)
    private String maxTorque;  //Nm

    @Column(name = "mileage_kmpl", length = 20)
    private String mileageKmpl;

    @Column(name = "top_speed_kmph", length = 20)
    private String topSpeedKmph;

    @Column(name = "gearbox", length = 20)
    private String gearbox; // 5-speed, 6-speed

    @Column(name = "clutch_type", length = 50)
    private String clutchType; //slipper clutch, wet multi-plate, etc

    // Brake : disc/drum + ABS
    @Column(name = "front_brake", length = 50)
    private String frontBrake;

    @Column(name = "rear_brake", length = 50)
    private String rearBrake;

    //F.Suspension : telescope, USD fork
    @Column(name = "front_suspension", length = 100)
    private String frontSuspension;

    //R.suspension : monoshock, dual-shock
    @Column(name = "rear_suspension", length = 100)
    private String rearSuspension;

    @Column(name = "front_tyre", length = 50)
    private String frontTyre;

    @Column(name = "rear_tyre", length = 50)
    private String rearTyre;

    @Column(name = "tyre_type", length = 30)
    private String tyreType;

    @Column(name = "fuel_tank_capacity_l", length = 20)
    private String fuelTankCapacityL;

    @Column(name = "seat_height_mm", length = 20)
    private String seatHeightMm;

    @Column(name = "ground_clearance_mm", length = 20)
    private String groundClearanceMm;

    @Column(name = "kerb_weight_kg", length = 20)
    private String kerbWeightKg;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();
}

//Json format to
// {
//        "name": "KTM Duke 200",
//        "brand": "KTM",
//        "type": "Naked",
//        "dimensionMmLWH": "2002 x 873 x 1274",
//        "engineCapacityCc": 200,
//        "engineType": "Liquid Cooled, Single Cylinder, DOHC",
//        "maxPower": "25 PS @ 10000 rpm",
//        "maxTorque": "19.5 Nm @ 8000 rpm",
//        "mileageKmpl": "35 km/l",
//        "topSpeedKmph": "142 km/h",
//        "gearbox": "6 Speed",
//        "clutchType": "Slipper Clutch",
//        "frontBrake": "300mm Disc, ABS",
//        "rearBrake": "230mm Disc, ABS",
//        "frontSuspension": "WP USD Fork",
//        "rearSuspension": "WP Monoshock",
//        "frontTyre": "110/70-17",
//        "rearTyre": "150/60-17",
//        "tyreType": "Tubeless",
//        "fuelTankCapacityL": "13.4 L",
//        "seatHeightMm": "822 mm",
//        "groundClearanceMm": "155 mm",
//        "kerbWeightKg": "159 kg",
//        "stock": 12,
//        "price": 245000.0,
//        "active": true,
//        "images": [
//        {
//        "imageUrl": "https://example.com/duke200-front.jpg",
//        "primary": true
//        },
//        {
//        "imageUrl": "https://example.com/duke200-side.jpg",
//        "primary": false
//        }
//        ]
//        }