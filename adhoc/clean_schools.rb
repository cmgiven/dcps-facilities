# Code for cleaning up 2013 Master Facilities Plan data 

require 'csv'

schools_data = CSV.read("mfp_schools_2013.csv")

schools = []
for s in schools_data[1..-1]
  schools << Hash[schools_data.first.zip(s)]
end

for s in schools
  # Excel messed this up for some reason
  for k in s.keys
    if s[k]
      s[k] = s[k].tr("_","-")
    end
  end

  if s["School Name"].include? "*"
    s["School Name"] = s["School Name"].tr("*","")
    s["Scheduled to Close"] = true
  else
    s["Scheduled to Close"] = false
  end

  for i in [3,5,6,7]
    k = schools_data.first[i]
    if s[k]
      s[k] = s[k].tr("^[0-9]", "")
    end
  end

  utilization = s["Utilization"].tr("^[0-9]", "")
  if utilization && utilization != ""
    s["Utilization"] = utilization.to_i * 0.01
  else
    s["Utilization"] = nil
  end
end

CSV.open("schools_data_clean.csv", "wb") do |csv|
  csv << (schools_data.first << "Scheduled to Close")
  for s in schools
    csv << s.values
  end
end


