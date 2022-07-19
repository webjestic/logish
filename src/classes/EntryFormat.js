/**
 * 
 */

module.exports = class EntryFormat {


    constructor() {  
    }

    
    formatEntry(formatStr, logEntry) {

        if (logEntry.timeToString !== undefined) formatStr = formatStr.replace('%date', logEntry.timeToString)
        else formatStr = formatStr.replace('%date', '')

        if (logEntry.level !== undefined) formatStr = formatStr.replace('%level', logEntry.level)
        else formatStr = formatStr.replace('%level', '')

        if (logEntry.namespace !== undefined) formatStr = formatStr.replace('%namespace', logEntry.namespace)
        else formatStr = formatStr.replace('%namespace', '')

        if (logEntry.hostname !== undefined) formatStr = formatStr.replace('%host', logEntry.hostname)
        else formatStr = formatStr.replace('%host', '')
        
        if (logEntry.message !== undefined) formatStr = formatStr.replace('%entry', logEntry.message)
        else formatStr = formatStr.replace('%entry', '')
        
        if (logEntry.perf_time !== undefined) formatStr = formatStr.replace('%perf', logEntry.perf_time)
        else formatStr = formatStr.replace('%perf', '')
        
        if (logEntry.protocol !== undefined) formatStr = formatStr.replace('%protocol', logEntry.protocol)
        else formatStr = formatStr.replace('%protocol', '')
        
        if (logEntry.ip !== undefined) formatStr = formatStr.replace('%ip', logEntry.ip)
        else formatStr = formatStr.replace('%ip', '')
        
        return formatStr
    }

}