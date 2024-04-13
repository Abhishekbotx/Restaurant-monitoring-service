const express = require('express');
const Store = require('../models/store.js')
const Timezone=require('../models/Timezone.js')
const cron = require('node-cron');
const BusinessHours=require('../models/BusinessHours.js')

 
const storeCreate = async (req, res) => {
    try {
        const { store_name, store_Address, opening_time, closing_time, timezone, open_days, isActive } = req.body;
        const newStore = await Store.create({
            store_name,
            store_Address,
            opening_time,
            closing_time,
            timezone,
            open_days,
            isActive
        });



        const newTimezoneObj=await Timezone.create({
            store_id:newStore._id,
            timezone:newStore.timezone
        })


        const response = open_days.map(async (day) => {
            await BusinessHours.create({
                store_id: newStore._id,
                day:day,
                start_time_local: opening_time, 
                end_time_local: closing_time 
            });
        });

        
        await Promise.all(response);
        res.json({
            success:"true" 
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}





const storeDelete = async (req, res) => {
    try {
        const { store_id } = req.body;
        const response=await Store.findByIdAndDelete({store_id})
        res.json({
            success:"true",
            message:"store delete successfully",
            name:response.store_name
        })

    } catch (error) {
        console.log(error)
        throw error
    }
}
const storeUpdate = async (req, res) => {
    try {
        const { store_id } = req.params;
        const { store_name, store_Address, opening_time, closing_time, open_days } = req.body;

        await Store.findOneAndUpdate({ store_id }, {
            store_name,
            store_Address,
            opening_time,
            closing_time,
            open_days 
        });
        
        res.json({
            success:"true",
            message:"store delete successfully",
            name:response.store_name
        })

    } catch (error) {
        console.log(error)
        throw error
    }
}
const storeToggleStatus = async (req, res) => {
    try {
        const { store_id } = req.body;
        const response=await Store.findOne({_id:store_id})
        console.log(response)
        
        response.isActive=!response.isActive
        await response.save()
        res.json({
            success:"true",
            message:"store status changes",
            status:response

        })

    } catch (error) {
        console.log(error)
        throw error
    }
}



module.exports={storeCreate,storeDelete,storeUpdate,storeToggleStatus} 