

listwords=[]

def chercher(word):
    if word in listwords:
        print("le mot existe")
    else:
        print("Introuvable")


def ajouter(mot) :
    listwords.append(mot)


def afficher():
    print(listwords)
    for w in listwords:
        print(w)


ajouter("speed")
ajouter("superman")

afficher()
chercher("speed man")