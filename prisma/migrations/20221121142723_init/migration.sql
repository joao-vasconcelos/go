-- CreateTable
CREATE TABLE "Agency" (
    "agency_id" TEXT NOT NULL DEFAULT 'tml_cmet',
    "agency_name" TEXT NOT NULL DEFAULT 'Carris Metropolitana',
    "agency_url" TEXT NOT NULL DEFAULT 'https://carrismetropolitana.pt',
    "agency_timezone" TEXT NOT NULL DEFAULT 'Europe/Lisbon',
    "agency_lang" TEXT NOT NULL DEFAULT 'pt_PT',
    "agency_phone" TEXT NOT NULL DEFAULT '00351210418800',
    "agency_fare_url" TEXT NOT NULL DEFAULT 'https://carrismetropolitana.pt/viagens-ocasionais/',
    "agency_email" TEXT NOT NULL DEFAULT 'info@carrismetropolitana.pt',

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("agency_id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "stop_id" TEXT NOT NULL,
    "stop_code" TEXT NOT NULL,
    "stop_name" TEXT NOT NULL,
    "stop_desc" TEXT,
    "stop_lat" DECIMAL(65,30) NOT NULL,
    "stop_lon" DECIMAL(65,30) NOT NULL,
    "zone_id" TEXT,
    "location_type" INTEGER NOT NULL DEFAULT 0,
    "wheelchair_boarding" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("stop_id")
);

-- CreateTable
CREATE TABLE "Route" (
    "route_id" TEXT NOT NULL,
    "agency_id" TEXT NOT NULL,
    "route_short_name" TEXT NOT NULL,
    "route_long_name" TEXT NOT NULL,
    "route_desc" TEXT,
    "route_type" INTEGER NOT NULL DEFAULT 3,
    "route_url" TEXT,
    "route_color" TEXT,
    "route_text_color" TEXT,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "trip_id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "trip_headsign" TEXT,
    "trip_short_name" TEXT,
    "direction_id" INTEGER,
    "shape_id" TEXT,
    "wheelchair_accessible" INTEGER NOT NULL DEFAULT 0,
    "bikes_allowed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "StopTime" (
    "stoptime_id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "departure_time" TEXT NOT NULL,
    "stop_id" TEXT NOT NULL,
    "stop_sequence" INTEGER NOT NULL,
    "shape_dist_traveled" DECIMAL(65,30),
    "timepoint" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StopTime_pkey" PRIMARY KEY ("stoptime_id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "service_id" TEXT NOT NULL,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "saturday" BOOLEAN NOT NULL DEFAULT false,
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "CalendarDate" (
    "service_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "exception_type" INTEGER NOT NULL,

    CONSTRAINT "CalendarDate_pkey" PRIMARY KEY ("service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stop_stop_code_key" ON "Stop"("stop_code");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "Agency"("agency_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopTime" ADD CONSTRAINT "StopTime_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;
