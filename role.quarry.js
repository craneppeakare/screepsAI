
module.exports = {

    run: function(creep) {

        if (creep.memory.container == undefined) {
            // Find a container has a source adjacent, have no other creep ontop, and is not full
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                                (creep.pos.isEqualTo(s) || !s.pos.lookFor(LOOK_CREEPS).length) &&
                                s.pos.findInRange(FIND_SOURCES, 2).length > 0 &&
                                _.sum(s.store) < s.storeCapacity});
            if (container != undefined)
                creep.memory.container = container.id;
            else
                return;
        }
        const container = Game.getObjectById(creep.memory.container);

        if (!creep.pos.isEqualTo(container.pos)) {
            creep.signaledMove(container);
            delete creep.memory.container;
        } else {
            const energy_source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (_.sum(container.store) < container.storeCapacity && creep.harvest(energy_source) == ERR_NOT_IN_RANGE) {
                creep.say("Out of range");
            } else {
                creep.room.visual.text(_.sum(container.store) + "/" + container.storeCapacity, creep.pos);
            }
        }
    }
};
